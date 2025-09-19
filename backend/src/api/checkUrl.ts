
import { Router } from 'express';
import axios from 'axios';
import https from 'https';
import type { Request, Response } from 'express';
import type { GoogleSafeBrowsingRequest, GoogleSafeBrowsingResponse } from '../types/googleSafeBrowsing';

const router = Router();


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
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'Invalid or missing URL.',
      details: 'Please provide a valid URL string.'
    });
  }
  const trimmedUrl = url.trim();
  
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