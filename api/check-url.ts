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