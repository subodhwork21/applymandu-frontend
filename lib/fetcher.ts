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
    if (response.status === 204) {
      return null;
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Handle error responses
    if (!response.ok) {
      throw new FetchError(
        response.status, 
        response.statusText || 'Request failed'
      );
    }
    
    return {result:data, response};
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

    if (!fetch) {
      throw new Error("Failed to fetch data");
    }
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