export interface GoogleSafeBrowsingRequest {
  client: { clientId: string; clientVersion: string };
  threatInfo: {
    threatTypes: string[];
    platformTypes: string[];
    threatEntryTypes: string[];
    threatEntries: { url: string }[];
  };
}

export interface GoogleSafeBrowsingResponse {
  matches?: Array<{
    threatType: string;
    platformType: string;
    threat: { url: string };
    cacheDuration: string;
    threatEntryType: string;
  }>;
}
