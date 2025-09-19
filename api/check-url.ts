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