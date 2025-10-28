
import express, { Router } from 'express';
import axios from 'axios';
import https from 'https';
import type { Request, Response } from 'express';
import type { GoogleSafeBrowsingRequest, GoogleSafeBrowsingResponse } from '../types/googleSafeBrowsing.js';

const router = Router();


const cache = new Map<string, { data: any; timestamp: number }>();
const normalizeUrlKey = (u: string): string => {
  try {
    const p = new URL(u);
    const isDefaultPort = (p.protocol === 'https:' && p.port === '443') || (p.protocol === 'http:' && p.port === '80');
    const port = p.port && !isDefaultPort ? `:${p.port}` : '';
    // Keep full path, query, and hash to avoid conflating different pages or query variants
    const fullPath = `${p.pathname}${p.search}${p.hash}`;
    // Lowercase the hostname for normalization; leave path as-is (can be case-sensitive on some servers)
    return `${p.protocol}//${p.hostname.toLowerCase()}${port}${fullPath}`;
  } catch {
    // If URL constructor fails, return raw string as-is for key stability
    return u;
  }
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedResult = (url: string): any | null => {
  const key = normalizeUrlKey(url);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    cache.delete(key); // Remove expired entry
  }
  return null;
};

const setCachedResult = (url: string, data: any): void => {
  const key = normalizeUrlKey(url);
  cache.set(key, { data, timestamp: Date.now() });
};

const getFinalRedirectUrl = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 7000,
      validateStatus: () => true 
    });
    return response.request?.res?.responseUrl || url;
  } catch {
    return url;
  }
};


const checkSSL = async (url: string): Promise<boolean> => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:') return false;
    return new Promise((resolve) => {
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: '/',
        method: 'HEAD',
        timeout: 5000,
        rejectUnauthorized: true // This will reject if SSL is invalid
      }, (res) => {
        res.on('data', () => {}); 
        res.on('end', () => resolve(true));
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    });
  } catch {
    return false;
  }
};

router.post('/check-url', async (req: Request, res: Response) => {
 
  const isDomainReachable = async (hostname: string): Promise<boolean> => {
    try {
      const dns = await import('dns').then(mod => mod.promises);
      await dns.lookup(hostname);
      return true;
    } catch {
      return false;
    }
  };
  console.log('--- Incoming /check-url request ---');
  // Sanitize and validate input URL
  const rawUrl = req.body?.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return res.status(400).json({
      error: 'Invalid or missing URL.',
      details: 'Please provide a valid URL string.'
    });
  }
  const trimmedUrl = rawUrl.trim().replace(/^['"]+|['"]+$/g, '');
  
  if (!trimmedUrl || /[\s\x00-\x1F\x7F"'<>`]/.test(trimmedUrl)) {
    return res.status(400).json({
      error: 'Invalid URL provided.',
      details: 'URL cannot be empty or contain spaces, quotes, or control characters.'
    });
  }
 
  let urlVariants: string[] = [];
  if (trimmedUrl.includes('://')) {
    urlVariants = [trimmedUrl];
  } else {
    urlVariants = [`https://${trimmedUrl}`, `http://${trimmedUrl}`];
  }

  urlVariants = urlVariants.filter(variant => {
    try {
      const parsedUrl = new URL(variant);
      if (!parsedUrl.hostname || parsedUrl.hostname.length < 4) return false;
      if (!parsedUrl.hostname.includes('.')) return false;
      return true;
    } catch {
      return false;
    }
  });
  if (urlVariants.length === 0) {
    return res.status(400).json({
      error: 'Invalid URL format.',
      details: 'Please provide a properly formatted URL.'
    });
  }
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Service configuration error.',
      details: 'Google Safe Browsing API key not configured.'
    });
  }

  for (const variant of urlVariants) {
    const cachedResult = getCachedResult(variant);
    if (cachedResult && cachedResult.safe === false) {
      return res.json({
        ...cachedResult,
        cached: true,
        cache_age: Math.round((Date.now() - cache.get(variant)!.timestamp) / 1000)
      });
    }
  }

  for (const variant of urlVariants) {
    const cachedResult = getCachedResult(variant);
    if (cachedResult && cachedResult.safe === true) {
      return res.json({
        ...cachedResult,
        cached: true,
        cache_age: Math.round((Date.now() - cache.get(variant)!.timestamp) / 1000)
      });
    }
  }
  
  for (const variant of urlVariants) {
    // Following any redirects to find the actual final URL
    const finalUrl = await getFinalRedirectUrl(variant);
    const urlsToCheck = finalUrl !== variant ? [variant, finalUrl] : [variant];
    for (const urlToCheck of urlsToCheck) {
      // Checking if the domain can be reached before checking with Safe Browsing
      try {
        const parsed = new URL(urlToCheck);
        const reachable = await isDomainReachable(parsed.hostname);
        if (!reachable) {
          const unreachableResult = {
            url: urlToCheck,
            safe: false,
            threat_type: 'UNREACHABLE_DOMAIN',
            platform_type: 'ANY_PLATFORM',
            threat_description: 'Domain is unreachable or does not exist. Treat as suspicious.',
            confidence: 'MEDIUM',
            matches: [],
            checked_variations: urlVariants.length,
            ssl_verified: false, // Unreachable domains can't have valid SSL
            recommendation: 'Do not trust this website. The domain does not resolve.',
            cached: false,
            warning: true
          };
          setCachedResult(urlToCheck, unreachableResult);
          return res.json(unreachableResult);
        }
      } catch (e) {
        // If we can't parse the URL, just move on to the next one
        continue;
      }
      const requestBody: GoogleSafeBrowsingRequest = {
        client: { clientId: 'clickshield', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION'
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: urlToCheck }]
        }
      };
      try {
        const { data } = await axios.post<GoogleSafeBrowsingResponse>(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
          requestBody,
          { timeout: 10000 }
        );
        if (data.matches && data.matches.length > 0) {
          const match = data.matches[0];
          const threatDetails = {
            MALWARE: 'This site contains malicious software that could harm your device',
            SOCIAL_ENGINEERING: 'This site is identified as a phishing attempt or social engineering attack',
            UNWANTED_SOFTWARE: 'This site may install unwanted software or browser extensions',
            POTENTIALLY_HARMFUL_APPLICATION: 'This site hosts potentially harmful applications'
          };
          const threatResult = {
            url: urlToCheck,
            safe: false,
            threat_type: match.threatType,
            platform_type: match.platformType,
            threat_description: threatDetails[match.threatType as keyof typeof threatDetails] || 'Unknown threat detected',
            confidence: 'HIGH',
            matches: data.matches,
            checked_variations: urlVariants.length,
            ssl_verified: await checkSSL(urlToCheck),
            recommendation: 'Do not visit this website. It has been flagged as dangerous.',
            cached: false
          };
          setCachedResult(urlToCheck, threatResult);
          return res.json(threatResult);
        } else {
          // Checking the SSL certificate if it's an HTTPS site
          const sslVerified = await checkSSL(urlToCheck);
          // Saving this safe result in the cache for later and return immediately
          const safeResult = {
            url: urlToCheck,
            safe: true,
            threat_type: 'NONE',
            platform_type: 'ANY_PLATFORM',
            threat_description: 'No known threats detected',
            confidence: 'HIGH',
            matches: [],
            checked_variations: urlVariants.length,
            ssl_verified: sslVerified,
            recommendation: 'This website appears safe, but always exercise caution online.',
            cached: false
          };
          console.log('Safe result computed for', urlToCheck);
          setCachedResult(urlToCheck, safeResult);
          return res.json(safeResult);
        }
      } catch (error: any) {
        console.error('Error querying Safe Browsing for', urlToCheck, error && error.stack ? error.stack : error);
        // Dealing with cases where we've hit the API limit or it's down
        if (error.response && error.response.status === 429) {
          return res.status(503).json({
            error: 'Google Safe Browsing quota exceeded',
            details: 'The service is temporarily unavailable due to quota limits. Please try again later.'
          });
        }
        if (error.response && error.response.status >= 500) {
          return res.status(503).json({
            error: 'Google Safe Browsing API unavailable',
            details: 'The service is temporarily unavailable. Please try again later.'
          });
        }
        // Moving on to check the next URL variant
  }
    }
  }
  // If all the variants are safe, send back the first safe one
  const firstSafe = getCachedResult(urlVariants[0]);
  if (firstSafe) {
    return res.json(firstSafe);
  }
  // If we get to this point, something unexpected happened
  console.error('Reached final fallback without a result for', urlVariants);
  return res.status(500).json({
    error: 'Unknown error',
    details: 'Unable to determine URL safety. Please try again.'
  });
});

// Create an Express app and mount the router so serverless platforms
// (like Vercel) can use this file as an entrypoint.
const app = express();

// CORS middleware for mobile compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use('/', router);

// Final error handler to ensure JSON responses instead of HTML error pages
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: 'Something went wrong while processing your request.'
  });
});

export default app;

