"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  permissions: string[];
  status: "active" | "inactive";
}

// Mock data for development
const mockApiKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Production API Key",
    key: "am_prod_8f7d9a62e3b5c1f4a0d2e6b9",
    created_at: "2024-05-15T10:30:00Z",
    last_used: "2024-06-01T14:22:15Z",
    permissions: ["read:jobs", "read:applications", "write:jobs"],
    status: "active",
  },
  {
    id: "key_2",
    name: "Development API Key",
    key: "am_dev_3a4b5c6d7e8f9g0h1i2j3k4l",
    created_at: "2024-04-20T08:15:00Z",
    last_used: "2024-05-28T09:45:30Z",
    permissions: ["read:jobs", "read:applications", "write:jobs", "write:applications"],
    status: "active",
  },
];

const codeExamples = {
  javascript: `// Fetch your job listings
const fetchJobs = async () => {
  const response = await fetch('https://api.applymandu.com/v1/employer/jobs', {
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
  const response = await fetch('https://api.applymandu.com/v1/employer/jobs', {
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
    url = "https://api.applymandu.com/v1/employer/jobs"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Create a new job posting
def create_job(job_data):
    url = "https://api.applymandu.com/v1/employer/jobs"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=job_data)
    return response.json()`,
  curl: `# Fetch your job listings
curl -X GET \\
  https://api.applymandu.com/v1/employer/jobs \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'

# Create a new job posting
curl -X POST \\
  https://api.applymandu.com/v1/employer/jobs \\
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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "read:jobs",
    "read:applications"
  ]);

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

  const regenerateApiKey = (keyId: string) => {
    // In a real app, you would call your API to regenerate the key
    const newKey = `am_${keyId.includes('prod') ? 'prod' : 'dev'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    setApiKeys(keys => keys.map(key => 
      key.id === keyId ? { ...key, key: newKey, created_at: new Date().toISOString() } : key
    ));
    
    toast({
      title: "API key regenerated",
      description: "Your new API key has been generated. The old key is no longer valid.",
    });
  };

  const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    const newKey: ApiKey = {
      id: `key_${Math.random().toString(36).substring(2, 9)}`,
      name: newKeyName,
      key: `am_dev_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created_at: new Date().toISOString(),
      last_used: null,
      permissions: selectedPermissions,
      status: "active",
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setSelectedPermissions(["read:jobs", "read:applications"]);

    toast({
      title: "API key created",
      description: "Your new API key has been created successfully.",
    });
  };

  const toggleKeyStatus = (keyId: string) => {
    setApiKeys(keys => keys.map(key => 
      key.id === keyId ? { ...key, status: key.status === "active" ? "inactive" : "active" } : key
    ));
    
    const key = apiKeys.find(k => k.id === keyId);
    toast({
      title: key?.status === "active" ? "API key deactivated" : "API key activated",
      description: key?.status === "active" 
        ? "Your API key has been deactivated and can no longer be used for API calls." 
        : "Your API key has been activated and can now be used for API calls.",
    });
  };

  const deleteApiKey = (keyId: string) => {
    setApiKeys(keys => keys.filter(key => key.id !== keyId));
    
    toast({
      title: "API key deleted",
      description: "Your API key has been permanently deleted.",
    });
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(perms => 
      perms.includes(permission)
        ? perms.filter(p => p !== permission)
        : [...perms, permission]
    );
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
                  
                  <div className="mt-6">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Premium Feature</AlertTitle>
                      <AlertDescription>
                        API access is available exclusively to premium subscribers. Your subscription includes 10,000 API requests per month.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
              
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
                  <div className="space-y-6">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <h3 className="font-medium text-manduSecondary">{apiKey.name}</h3>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(apiKey.created_at).toLocaleDateString()} 
                              {apiKey.last_used && ` • Last used: ${new Date(apiKey.last_used).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {apiKey.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                          <div className="relative flex-grow w-full">
                            <Input
                              type={showApiKey[apiKey.id] ? "text" : "password"}
                              value={apiKey.key}
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
                    ))}
                  </div>
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
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Give your API key a descriptive name to identify its purpose.
                      </p>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Permissions</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="read-jobs"
                            checked={selectedPermissions.includes("read:jobs")}
                            onCheckedChange={() => togglePermission("read:jobs")}
                          />
                          <Label htmlFor="read-jobs">read:jobs - View job listings</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="write-jobs"
                            checked={selectedPermissions.includes("write:jobs")}
                            onCheckedChange={() => togglePermission("write:jobs")}
                          />
                          <Label htmlFor="write-jobs">write:jobs - Create and update jobs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="read-applications"
                            checked={selectedPermissions.includes("read:applications")}
                            onCheckedChange={() => togglePermission("read:applications")}
                          />
                          <Label htmlFor="read-applications">read:applications - View applications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="write-applications"
                            checked={selectedPermissions.includes("write:applications")}
                            onCheckedChange={() => togglePermission("write:applications")}
                          />
                          <Label htmlFor="write-applications">write:applications - Update application status</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="read-analytics"
                            checked={selectedPermissions.includes("read:analytics")}
                            onCheckedChange={() => togglePermission("read:analytics")}
                          />
                          <Label htmlFor="read-analytics">read:analytics - Access analytics data</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={createNewApiKey}>
                        Create API Key
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab */}
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
                        <code className="text-sm flex-grow">https://api.applymandu.com/v1</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("https://api.applymandu.com/v1")}
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
                        <p className="text-sm text-gray-600">
                          Your subscription includes 10,000 API requests per month. Current usage: 1,245 requests (12.45%)
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "12.45%" }}></div>
                        </div>
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

