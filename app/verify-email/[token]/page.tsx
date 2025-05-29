'use client'
import { toast } from "@/hooks/use-toast";
import { baseFetcher } from "@/lib/fetcher";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () =>{
    const {token} = useParams();
    const router = useRouter();

    useEffect(()=>{
        const verifyEmail = async () => {
            const {response, result, errors} = await baseFetcher("api/verify-email", {
                method: "POST",
            body: JSON.stringify({
                token: token
            })
        });
        if(response?.ok){
            toast({
                title: "Email verified successfully",
                description: "Your email has been verified successfully",
            });
            router.push("/");
        }
        else{
            toast({
                title: "Error verifying email",
                description: errors,
            });
            router.push("/");
        }

    }

    verifyEmail();
    }, [token, router]);

    return <div className="h-screen w-full flex justify-center items-center">
        <h1>Verifying Your Email...</h1>
    </div>
}

export default Page;