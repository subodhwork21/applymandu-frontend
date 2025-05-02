import { getCookie } from "cookies-next/client";

export function jobSeekerToken(): string{
    return getCookie('JOBSEEKER_TOKEN') as string;
}

export function employerToken(): string{
    return getCookie("EMPLOYER_TOKEN") as string;
}