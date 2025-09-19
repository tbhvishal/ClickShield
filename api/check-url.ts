import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import https from 'https';
import dns from 'dns';

// Simple in-memory cache for API responses (5 minutes TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedResult = (url: string): any | null => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    cache.delete(url); // Remove expired entry
  }
  return null;
};

const setCachedResult = (url: string, data: any): void => {
  cache.set(url, { data, timestamp: Date.now() });
};

// Helper to follow redirects and return the final URL
const getFinalRedirectUrl = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 7000,
      validateStatus: () => true // Accept all status codes
    });
    return response.request?.res?.responseUrl || url;
  } catch {
    return url;
  }
};

// Helper to check SSL certificate validity for HTTPS URLs
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
        res.on('data', () => {}); // Consume data
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Helper to check if a domain is reachable (DNS lookup)
  const isDomainReachable = async (hostname: string): Promise<boolean> => {
    return new Promise((resolve) => {
      dns.lookup(hostname, (err) => {
        resolve(!err);
      });
    });
  };

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'Invalid or missing URL.',
      details: 'Please provide a valid URL string.'
    });
  }

  const trimmedUrl = url.trim();

  // Strict input validation: reject URLs with spaces, control chars, or invalid chars
  if (!trimmedUrl || /[\s\x00-\x1F\x7F"'<>`]/.test(trimmedUrl)) {
    return res.status(400).json({
      error: 'Invalid URL provided.',
      details: 'URL cannot be empty or contain spaces, quotes, or control characters.'
    });
  }

  // Build protocol variants
  let urlVariants: string[] = [];
  if (trimmedUrl.includes('://')) {
    urlVariants = [trimmedUrl];
  } else {
    urlVariants = [`https://${trimmedUrl}`, `http://${trimmedUrl}`];
  }

  // Validate variants
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

  // Check cache for threats first
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

  // If all cached results are safe, return the first one
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

  // Check all protocol variants with Safe Browsing, including following redirects
  for (const variant of urlVariants) {
    // Follow redirects to get the final URL
    const finalUrl = await getFinalRedirectUrl(variant);
    const urlsToCheck = finalUrl !== variant ? [variant, finalUrl] : [variant];

    for (const urlToCheck of urlsToCheck) {
      // Check if the domain is reachable before Safe Browsing
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
        // If URL parsing fails, skip to next
        continue;
      }

      const requestBody = {
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
        const { data } = await axios.post(
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
          // Check SSL if HTTPS
          const sslVerified = await checkSSL(urlToCheck);
          // Cache safe result for this variant
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
          setCachedResult(urlToCheck, safeResult);
        }
      } catch (error: any) {
        // Handle quota exceeded or API unavailable
        if (error.response && error.response.status === 429) {
          return res.status(503).json({
            error: 'Google Safe Browsing quota exceeded',
            details: 'The service is temporarily unavailable due to quota limits. Please try again later.'
          });
        }
        if (error.response && error.response.status >= 500) {
          return res.status(503).json({
            error: 'Google Safe Browsing API unavailable',