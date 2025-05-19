import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";

export default function BannerSignup(){
    return <>
        <div className="w-full py-[16] px-[512px] bg-[#013893]">
            <h2>
                Ready to Find Your Next Opportunity? 
            </h2>
            <p>Join thousands of professionals who've found their dream jobs through Applymandu</p>
            <div>

            <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create an Account
            </Button>
             <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create an Account
            </Button>
            </div>
        </div>
    </>
}