import { jobSeekerToken, employerToken } from "./tokens";

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
        "Authorization": `Bearer ${jobSeekerToken() || employerToken()}`,
        ...options.headers,
      },
      ...options,
    });
  
  // Handle server error (500) - throw an error
  if (response.status === 500) {
    throw new FetchError(500, "Something went wrong");
  }

  // Try to parse the response as JSON
  let data;
  try {
    // Some APIs might return empty responses for certain status codes
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
    let errors = data.errors;
        for (const key in errors) {
          if (errors.hasOwnProperty(key) && errors[key].length > 0) {
              errors = errors[key][0];
            };
          }
        }
   catch (error) {
    console.error("Error parsing response:", error);
    return {
      result: null,
      response,
      errors: "",
      error: new Error("Invalid JSON response"),
      message: "Invalid JSON response",
    };
  }
  // const firstErrors: Record<string, any> = {};
  
  let firstErrors = data.errors;
  for (const key in firstErrors) {
    if (firstErrors.hasOwnProperty(key) && firstErrors[key].length > 0) {
      firstErrors = firstErrors[key][0];
      };
    }

  // Handle client errors (400, 404, 422) - return error with message
  if (response.status === 400 || response?.status === 401 || response.status === 404 || response.status === 422) {
    
  
    return {
      result: data,
      response,
      errors: firstErrors,
      error: {
        status: response.status,
        data: data
      },
      message: data?.message || `Error ${response.status}`,
    };
  }

  // Handle no content responses (204)
  if (response.status === 204) {
    return {
      result: null,
      errors: firstErrors,
      response,
      error: null,
      message: null,
    };
  }

  // Handle other error responses
  if (!response.ok) {
    // Create an error object with the response data
    const errorObj: any = new Error(data?.message || "API request failed");
    errorObj.status = response.status;
    errorObj.data = data;
    
    // Return the error instead of throwing it
    return {
      result: null,
      response,
      errors: firstErrors,
      error: "",
      message: data?.message || "API request failed",
    };
  }

  // Return successful response
  return {
    result: data,
    response,
    errors: firstErrors,
    error: "",
    message: data?.message,
  };
}

export async function baseFetcher(
  url: string,
  options: RequestInit = {}
) {
  try{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      throw new Error("API URL is not defined");
    }
  
    const fullUrl = `${baseUrl}${url}`;
    const fetch = await fetchApi(fullUrl, options);

    return fetch;
  }
  catch(e){
    return {
      result: null,
      response: null,
      errors: "",
      error: e,
      message: "Error in fetcher",
    };
  }
  
}

const defaultFetcher = async <T>(url: string): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(baseUrl + url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jobSeekerToken() || employerToken()}`
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

export { defaultFetcher };
