
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