import { HeartIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function SaveJob({
    job, handleSaveJob
}: {
    job: {
        id: number,
        saved: boolean | null,
    },
    handleSaveJob: (id: number, saved: boolean) => Promise<void>
}){
    return <>{job?.saved === true ? (
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveJob(job?.id, job?.saved!);
                                    }}
                                    // variant="ghost"
                                    size="icon"
                                    className="bg-white border border-grayText rounded-full"
                                  >
                                    <HeartIcon fill="#D1D1D1" size={25} />
                                  </Button>
                                ) : job?.saved === false ? (
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveJob(job?.id, job?.saved!);
                                    }}
                                    variant="ghost"
                                    size="icon"
                                    className="border shadow-sm border-grayText rounded-full"
                                  >
                                    <HeartIcon size={20} />
                                  </Button>
                                ) : null}
                                </> 
}