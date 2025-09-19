
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