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