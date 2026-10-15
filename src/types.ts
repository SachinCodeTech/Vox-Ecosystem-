import React from 'react';

export interface AppItem {
  id: string;
  name: string;
  desc: string;
  url?: string;
  live: boolean;
  logo?: string;
  bg: string;
  icon?: string;
}

export interface ServiceState {
  enabled: boolean;
  message: string;
}

export interface ServicesConfig {
  updated?: string;
  services: Record<string, ServiceState>;
}

export type ViewType = 'apps' | 'info' | 'about' | 'versions' | 'privacy' | 'terms' | 'admin';

export interface GitHubConnection {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  remember: boolean;
}
