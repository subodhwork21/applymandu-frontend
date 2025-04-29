import { getCookie } from "cookies-next/client";

export function jobSeekerToken(): string{
    return getCookie('jobSeekerToken') as string;
}

export function employerToken(): string{
    return getCookie("employerToken") as string;
}