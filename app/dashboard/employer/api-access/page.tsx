"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  FileCode,
  BookOpen,
  Terminal,
  Lock,
  Key,
  Shield,
  Mail,
  HelpCircle,
  Trash,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiKeyService, type ApiKeyData } from "@/lib/apiKeys";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  key_prefix: string;
  masked_key?: string;
  created_at: string;
  last_used_at: string | null;
  formatted_last_used?: string;
  permissions: string[];
  status: "active" | "inactive";
  usage_count: number;
  monthly_limit: number;
  current_month_usage: number;
  usage_percentage: number;
  can_make_request: boolean;
}

interface Statistics {
  total_api_keys: number;
  active_api_keys: number;
  total_monthly_usage: number;
  total_monthly_limit: number;
  usage_percentage: number;
  requests_this_month: number;
  requests_today: number;
}

const codeExamples = {
  javascript: `// Fetch your job listings
const fetchJobs = async () => {
  const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/jobs', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
};

// Create a new job posting
const createJob = async (jobData) => {
  const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/jobs', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  });
  
  const data = await response.json();
  return data;
};`,
  python: `import requests

# Fetch your job listings
def fetch_jobs():
    url = "${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/jobs"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Create a new job posting
def create_job(job_data):
    url = "${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/jobs"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=job_data)
    return response.json()`,
  curl: `# Fetch your job listings
curl -X GET \\
  ${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/jobs \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'

# Create a new job posting
curl -X POST \\
  ${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/jobs \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "title": "Software Engineer",
    "description": "We are looking for a talented software engineer...",
    "location": "Kathmandu",
    "employment_type": "full-time",
    "salary_min": "60000",
    "salary_max": "90000",
    "skills": ["JavaScript", "React", "Node.js"]
  }'`
};

const EmployerApiAccessPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "read:jobs",
    "read:applications"
  ]);

  // Available permissions
  const availablePermissions = [
    { key: "read:jobs", label: "read:jobs - View job listings" },
    { key: "write:jobs", label: "write:jobs - Create and update jobs" },
    { key: "read:applications", label: "read:applications - View applications" },
    { key: "write:applications", label: "write:applications - Update application status" },
    { key: "read:analytics", label: "read:analytics - Access analytics data" },
  ];

  // Load API keys and statistics
  useEffect(() => {
    loadApiKeys();
    loadStatistics();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await apiKeyService.getApiKeys();
      if (response.success) {
        setApiKeys(response.data);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiKeyService.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const copyCodeExample = () => {
    navigator.clipboard.writeText(codeExamples[codeLanguage as keyof typeof codeExamples]);
    toast({
      title: "Code example copied",
      description: "Code example has been copied to your clipboard.",
    });
  };

  const regenerateApiKey = async (keyId: string) => {
    try {
      const response = await apiKeyService.regenerateApiKey(keyId);
      if (response.success) {
        // Update the key in the list
        setApiKeys(keys => keys.map(key => 
          key.id === keyId ? { ...key, ...response.data } : key
        ));
        
        toast({
          title: "API key regenerated",
          description: "Your new API key has been generated. The old key is no longer valid.",
        });

        // Show the new key temporarily
        setShowApiKey(prev => ({ ...prev, [keyId]: true }));
        setTimeout(() => {
          setShowApiKey(prev => ({ ...prev, [keyId]: false }));
        }, 30000); // Hide after 30 seconds
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate API key",
        variant: "destructive",
      });
    }
  };

  const createNewApiKey = async () => {

    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      const apiKeyData: ApiKeyData = {
        name: newKeyName,
        permissions: selectedPermissions,
        monthly_limit: 10000,
      };

      const response = await apiKeyService.createApiKey(apiKeyData);
      
      if (response.success) {
        setApiKeys([response.data, ...apiKeys]);
        setNewKeyName("");
        setSelectedPermissions(["read:jobs", "read:applications"]);
        
        toast({
          title: "API key created",
          description: response.message || "Your new API key has been created successfully.",
        });

        // Show the new key temporarily
        setShowApiKey(prev => ({ ...prev, [response.data.id]: true }));
        setTimeout(() => {
          setShowApiKey(prev => ({ ...prev, [response.data.id]: false }));
        }, 60000); // Hide after 1 minute

        // Reload statistics
        loadStatistics();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleKeyStatus = async (keyId: string) => {
    try {
      const response = await apiKeyService.toggleApiKeyStatus(keyId);
      if (response.success) {
        setApiKeys(keys => keys.map(key => 
          key.id === keyId ? { ...key, ...response.data } : key
        ));
        
        toast({
          title: "Status updated",
          description: response.message || "API key status has been updated.",
        });

        // Reload statistics
        loadStatistics();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle API key status",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await apiKeyService.deleteApiKey(keyId);
      
      if (response.success) {
        setApiKeys(keys => keys.filter(key => key.id !== keyId));
        
        toast({
          title: "API key deleted",
          description: "Your API key has been permanently deleted.",
        });

        // Reload statistics
        loadStatistics();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(perms => 
      perms.includes(permission)
        ? perms.filter(p => p !== permission)
        : [...perms, permission]
    );
  };

  const testApiKey = async (apiKey: string) => {
    try {
      const response = await apiKeyService.testApiKey(apiKey);
      
      if (response.success) {
        toast({
          title: "API key test successful",
          description: response.message || "Your API key is working correctly.",
        });
      }
    } catch (error: any) {
      toast({
        title: "API key test failed",
        description: error.message || "Your API key is not working properly.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            API Access
          </h1>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Documentation
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-manduSecondary">
                    API Integration for Employers
                  </CardTitle>
                  <CardDescription>
                    Connect your systems directly to Applymandu's platform to automate job postings, application management, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <FileCode className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-manduSecondary mb-2">Job Management</h3>
                      <p className="text-sm text-gray-600">
                        Programmatically create, update, and manage your job postings through our API.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-manduSecondary mb-2">Application Tracking</h3>
                      <p className="text-sm text-gray-600">
                        Access and manage job applications directly from your own systems and ATS.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-medium text-manduSecondary mb-2">Analytics Data</h3>
                      <p className="text-sm text-gray-600">
                        Pull analytics data into your dashboards for comprehensive reporting.
                      </p>
                    </div>
                  </div>
                  
                  {statistics && (
                    <div className="mt-6">
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertTitle>Your API Usage</AlertTitle>
                        <AlertDescription>
                          You have {statistics.active_api_keys} active API keys with {statistics.usage_percentage}% of your monthly limit used 
                          ({statistics.total_monthly_usage.toLocaleString()} / {statistics.total_monthly_limit.toLocaleString()} requests).
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Getting Started section remains the same */}
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-manduSecondary">
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-manduSecondary mb-1">Generate an API Key</h3>
                        <p className="text-sm text-gray-600">
                          Create an API key with the specific permissions you need. Go to the "API Keys" tab to generate your first key.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-manduSecondary mb-1">Include the API Key in Your Requests</h3>
                        <p className="text-sm text-gray-600">
                          Add your API key to the Authorization header of your HTTP requests: <code className="bg-gray-100 px-1 py-0.5 rounded">Authorization: Bearer YOUR_API_KEY</code>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-manduSecondary mb-1">Make API Requests</h3>
                        <p className="text-sm text-gray-600">
                          Start making requests to our API endpoints. Check the "Documentation" tab for detailed API references and examples.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-manduSecondary mb-3">Example Code</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`text-xs ${codeLanguage === 'javascript' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setCodeLanguage('javascript')}
                          >
                            JavaScript
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`text-xs ${codeLanguage === 'python' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setCodeLanguage('python')}
                          >
                            Python
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`text-xs ${codeLanguage === 'curl' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setCodeLanguage('curl')}
                          >
                            cURL
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                          onClick={copyCodeExample}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                        {codeExamples[codeLanguage as keyof typeof codeExamples]}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="keys">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-manduSecondary">
                    Manage API Keys
                  </CardTitle>
                  <CardDescription>
                    Create, regenerate, and manage your API keys. Keep your keys secure and never share them publicly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading API keys...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {apiKeys.length === 0 ? (
                        <div className="text-center py-8">
                          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
                          <p className="text-gray-600 mb-4">You haven't created any API keys yet. Create your first API key to get started.</p>
                        </div>
                      ) : (
                        apiKeys.map((apiKey) => (
                          <div key={apiKey.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                              <div>
                                <h3 className="font-medium text-manduSecondary">{apiKey.name}</h3>
                                <p className="text-xs text-gray-500">
                                  Created: {new Date(apiKey.created_at).toLocaleDateString()} 
                                  {apiKey.formatted_last_used && ` • Last used: ${apiKey.formatted_last_used}`}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {apiKey.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                {!apiKey.can_make_request && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                    Over Limit
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                              <div className="relative flex-grow w-full">
                                <Input
                                  type={showApiKey[apiKey.id] ? "text" : "password"}
                                  value={showApiKey[apiKey.id] ? apiKey.key : (apiKey.masked_key || apiKey.key_prefix + '••••••••••••••••••••••')}
                                  readOnly
                                  className="pr-20 font-mono text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-10 top-0 h-full"
                                  onClick={() => toggleApiKeyVisibility(apiKey.id)}
                                >
                                  {showApiKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full"
                                  onClick={() => copyToClipboard(apiKey.key)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                              <div className="flex flex-wrap gap-2">
                                {apiKey.permissions.map((permission) => (
                                  <span key={permission} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                    {permission}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Usage:</h4>
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>{apiKey?.current_month_usage?.toLocaleString()} requests</span>
                                    <span>{apiKey?.monthly_limit?.toLocaleString()} limit</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        apiKey.usage_percentage > 90 ? 'bg-red-500' : 
                                        apiKey.usage_percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}
                                      style={{ width: `${Math.min(apiKey.usage_percentage, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-600">
                                  {apiKey.usage_percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => regenerateApiKey(apiKey.id)}
                              >
                                <RefreshCw className="h-3 w-3" />
                                Regenerate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => testApiKey(apiKey.key)}
                              >
                                <Check className="h-3 w-3" />
                                Test
                              </Button>
                              <Button
                                variant={apiKey.status === 'active' ? "destructive" : "outline"}
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => toggleKeyStatus(apiKey.id)}
                              >
                                {apiKey.status === 'active' ? (
                                  <>
                                    <Lock className="h-3 w-3" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-3 w-3" />
                                    Activate
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => deleteApiKey(apiKey.id)}
                              >
                                <Trash className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-manduSecondary">
                    Create New API Key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="key-name">API Key Name</Label>
                      <Input
                        id="key-name"
                        placeholder="e.g., Production API Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        disabled={creating}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Give your API key a descriptive name to identify its purpose.
                      </p>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Permissions</Label>
                      <div className="space-y-2">
                        {availablePermissions.map((permission) => (
                          <div key={permission.key} className="flex items-center space-x-2">
                            <Switch
                              id={permission.key}
                              checked={selectedPermissions.includes(permission.key)}
                              onCheckedChange={() => togglePermission(permission.key)}
                              disabled={creating}
                            />
                            <Label htmlFor={permission.key} className="text-sm">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={createNewApiKey}
                        disabled={creating || !newKeyName.trim() || selectedPermissions.length === 0}
                        className="flex items-center gap-2"
                      >
                        {creating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4" />
                            Create API Key
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab - Keep existing content */}
            <TabsContent value="docs">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-manduSecondary">
                    API Documentation
                  </CardTitle>
                  <CardDescription>
                    Comprehensive documentation for the Applymandu API. Learn how to integrate with our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-manduSecondary mb-2">API Base URL</h3>
                      <div className="flex items-center bg-white border rounded p-2">
                        <code className="text-sm flex-grow">{process.env.NEXT_PUBLIC_API_URL}/api/v1</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_API_URL}/api/v1`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        All API requests should be made to this base URL followed by the specific endpoint.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-manduSecondary mb-3">Authentication</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        All API requests require authentication using your API key in the Authorization header:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <code className="text-sm text-gray-300">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-manduSecondary mb-3">Available Endpoints</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary flex items-center">
                            <FileCode className="h-4 w-4 mr-2" />
                            Jobs
                          </h4>
                          <div className="mt-2 space-y-2">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/jobs</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                List all your job postings with pagination support.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/jobs/{'{job_id}'}</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Get details of a specific job posting.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md mr-2">POST</span>
                                <code className="text-sm">/employer/jobs</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Create a new job posting.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md mr-2">PUT</span>
                                <code className="text-sm">/employer/jobs/{'{job_id}'}</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Update an existing job posting.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md mr-2">DELETE</span>
                                <code className="text-sm">/employer/jobs/{'{job_id}'}</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Delete a job posting.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary flex items-center">
                            <FileCode className="h-4 w-4 mr-2" />
                            Applications
                          </h4>
                          <div className="mt-2 space-y-2">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/applications</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                List all applications for your job postings.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/jobs/{'{job_id}'}/applications</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                List all applications for a specific job.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md mr-2">PUT</span>
                                <code className="text-sm">/employer/applications/{'{application_id}'}/status</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Update the status of an application.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary flex items-center">
                            <FileCode className="h-4 w-4 mr-2" />
                            Analytics
                          </h4>
                          <div className="mt-2 space-y-2">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/analytics/overview</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Get overview analytics for all your jobs.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/analytics/jobs/{'{job_id}'}</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Get detailed analytics for a specific job.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mr-2">GET</span>
                                <code className="text-sm">/employer/analytics/demographics</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Get demographic data about your applicants.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => window.open("https://docs.applymandu.com/api", "_blank")}
                    >
                      <BookOpen className="h-4 w-4" />
                      View Full API Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Terminal className="h-5 w-5 mr-2" />
                      Rate Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-manduSecondary mb-2">Premium Plan Limits</h4>
                        {statistics ? (
                          <>
                            <p className="text-sm text-gray-600">
                              Your subscription includes {statistics.total_monthly_limit.toLocaleString()} API requests per month. 
                              Current usage: {statistics.total_monthly_usage.toLocaleString()} requests ({statistics.usage_percentage.toFixed(2)}%)
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  statistics.usage_percentage > 90 ? 'bg-red-600' : 
                                  statistics.usage_percentage > 70 ? 'bg-yellow-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${Math.min(statistics.usage_percentage, 100)}%` }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Loading usage statistics...
                          </p>
                        )}
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-manduSecondary mb-2">Concurrent Requests</h4>
                        <p className="text-sm text-gray-600">
                          Maximum of 10 concurrent requests allowed per API key.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-manduSecondary mb-2">Burst Rate Limit</h4>
                        <p className="text-sm text-gray-600">
                          Maximum of 100 requests per minute to prevent API abuse.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Lock className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary">Keep Your API Keys Secret</h4>
                          <p className="text-xs text-gray-600">
                            Never expose your API keys in client-side code or public repositories.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Lock className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary">Use Minimal Permissions</h4>
                          <p className="text-xs text-gray-600">
                            Only grant the permissions that your integration actually needs.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Lock className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary">Rotate Keys Regularly</h4>
                          <p className="text-xs text-gray-600">
                            Regenerate your API keys periodically to minimize the impact of potential leaks.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Lock className="h-3 w-3 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-manduSecondary">Monitor API Usage</h4>
                          <p className="text-xs text-gray-600">
                            Regularly check your API usage for any suspicious activity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    API Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
                      onClick={() => window.open("https://docs.applymandu.com/api/reference", "_blank")}
                    >
                      <FileCode className="h-6 w-6 text-manduCustom-secondary-blue" />
                      <span>API Reference</span>
                      <span className="text-xs text-grayColor">Complete endpoint docs</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
                      onClick={() => window.open("https://docs.applymandu.com/api/tutorials", "_blank")}
                    >
                      <BookOpen className="h-6 w-6 text-manduCustom-secondary-blue" />
                      <span>Tutorials</span>
                      <span className="text-xs text-grayColor">Step-by-step guides</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
                      onClick={() => window.open("https://github.com/applymandu/api-examples", "_blank")}
                    >
                      <Code className="h-6 w-6 text-manduCustom-secondary-blue" />
                      <span>Code Examples</span>
                      <span className="text-xs text-grayColor">Sample integrations</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Support Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
              <HelpCircle className="h-8 w-8 text-manduCustom-secondary-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-manduSecondary">Need Help with API Integration?</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Our developer support team is available to help you with any questions or issues you encounter while integrating with our API.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open("mailto:api-support@applymandu.com")}
                >
                  <Mail className="h-4 w-4" />
                  Contact API Support
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open("https://docs.applymandu.com/api/faq", "_blank")}
                >
                  <HelpCircle className="h-4 w-4" />
                  View API FAQs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerApiAccessPage;
