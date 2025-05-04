import { jobSeekerToken } from "./tokens";

export class FetchError extends Error {
    status: number;
    
    constructor(status: number, message: string) {
      super(message);
      this.name = 'FetchError';
      this.status = status;
    }
  }


export async function fetchApi(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        "Authorization": `Bearer ${jobSeekerToken()}`
      },
      ...options,
    });
  
  // Handle no content responses
if (response.status === 500) {
  return {
    result: null,
    response: response,
    error: null,
  };
}

if (response.status === 204 || response.status === 404) {
  return {
    result: null,
    response: response,
    error: null,
    message: null,
  };
}

// Try to parse the response as JSON
let data;
try {
  // Some APIs might return empty responses for certain status codes
  const text = await response.text();
  data = text ? JSON.parse(text) : null;
} catch (error) {
  console.error("Error parsing response:", error);
  return {
    result: null,
    response,
    error: new Error("Invalid JSON response"),
    message: null,
  };
}

// Handle error responses
if (!response.ok) {
  // Create an error object with the response data
  const errorObj: any = new Error(data?.message || "API request failed");
  errorObj.status = response.status;
  errorObj.data = data;
  
  // Return the error instead of throwing it
  return {
    result: null,
    response,
    error: errorObj,
    message: data?.message,
  };
}

// Return successful response
return {
  result: data,
  response,
  error: null,
  message: data?.message,
};
  }



export async function baseFetcher(
  url: string,
  options: RequestInit = {}
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("API URL is not defined");
  }


    const fullUrl = `${baseUrl}${url}`;

    const fetch = await fetchApi (fullUrl, options);

    // if (!fetch) {
    //   throw new Error(fetch?.message);
    // }
    return fetch;
}


const defaultFetcher = async <T>(url: string): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(baseUrl + url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jobSeekerToken()}`
        }
    });
    
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object.
      (error as any).info = await response.json();
      (error as any).status = response.status;
      throw error;
    }
    
    return response.json() as Promise<T>;
  };
  
  export {defaultFetcher};