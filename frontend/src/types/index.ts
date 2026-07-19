export interface DashboardStats {
  totalRepositories: number;
  activePolicies: number;
  openPullRequests: number;
  recentFindings: number;
}

export interface Repository {
  id: string;
  name: string;
  description?: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  userId?: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'ignored';
}

export interface PR {
  id: string;
  title: string;
  status: 'open' | 'closed' | 'merged';
  author: string;
  createdAt: string;
  repositoryId: string;
}
