import { getCookie } from "cookies-next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiKeyData {
  name: string;
  permissions: string[];
  monthly_limit?: number;
  expires_at?: string;
}

interface ApiKeyUpdateData {
  name?: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
  monthly_limit?: number;
  expires_at?: string;
}

class ApiKeyService {
  private getAuthHeaders() {
    const token = getCookie("EMPLOYER_TOKEN");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getApiKeys() {
    const response = await fetch(`${API_BASE_URL}api/api-keys`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }
    
    return response.json();
  }

  async createApiKey(data: ApiKeyData) {
    const response = await fetch(`${API_BASE_URL}api/api-keys`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create API key');
    }
    
    return response.json();
  }

  async updateApiKey(keyId: string, data: ApiKeyUpdateData) {
    const response = await fetch(`${API_BASE_URL}api/api-keys/${keyId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update API key');
    }
    
    return response.json();
  }

  async deleteApiKey(keyId: string) {
    const response = await fetch(`${API_BASE_URL}api/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete API key');
    }
    
    return response.json();
  }

  async regenerateApiKey(keyId: string) {
    const response = await fetch(`${API_BASE_URL}api/api-keys/${keyId}/regenerate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to regenerate API key');
    }
    
    return response.json();
  }

  async toggleApiKeyStatus(keyId: string) {
    const response = await fetch(`${API_BASE_URL}api/api-keys/${keyId}/toggle-status`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle API key status');
    }
    
    return response.json();
  }

  async getPermissions() {
    const response = await fetch(`${API_BASE_URL}api/api-keys/permissions`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }
    
    return response.json();
  }

  async getStatistics() {
    const response = await fetch(`${API_BASE_URL}api/api-keys/statistics`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    return response.json();
  }

  async testApiKey(apiKey: string) {
    const response = await fetch(`${API_BASE_URL}api/api-keys/test`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ api_key: apiKey }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API key test failed');
    }
    
    return response.json();
  }
}

export const apiKeyService = new ApiKeyService();
export type { ApiKeyData, ApiKeyUpdateData };
