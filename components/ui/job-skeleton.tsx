export function JobSkeletonMax() {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-5 w-20 bg-neutral-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 my-3">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`skill-skeleton-${i}`}
                          className="h-6 w-20 bg-neutral-200 rounded-md animate-pulse"
                        ></div>
                      ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-10 w-32 bg-neutral-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  }

  import React from "react";

export function JobSkeletonMini({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div 
            key={`job-list-skeleton-${index}`} 
            className="bg-white rounded-lg p-6 border border-neutral-200 h-full flex flex-col"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 p-2 bg-neutral-200 rounded-lg flex-shrink-0 animate-pulse"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="h-5 w-40 bg-neutral-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-12 w-full bg-neutral-200 rounded animate-pulse mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={`skill-list-skeleton-${i}`}
                        className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse"
                      ></div>
                    ))}
                </div>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-neutral-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
