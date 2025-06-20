import { getCookie } from "cookies-next";

export function jobSeekerToken(): string{
    return getCookie('JOBSEEKER_TOKEN') as string || getCookie("IMP_TOKEN") as string;
}

export function employerToken(): string{
    return getCookie("EMPLOYER_TOKEN") as string || getCookie("IMP_TOKEN") as string;
}

export function adminToken(): string{
    return getCookie("ADMIN_TOKEN") as string;
}