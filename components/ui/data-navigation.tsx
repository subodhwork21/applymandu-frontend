"use client";

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

// Define the TypeScript interfaces for the pagination data
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface DataNavigationProps {
  meta: PaginationMeta;
  onPageChange?: (url: string) => void;
  className?: string;
}

const DataNavigation: React.FC<DataNavigationProps> = ({ 
  meta, 
  onPageChange,
  className = "" 
}) => {
  if (!meta || meta.total <= meta.per_page) {
    return null; // Don't render pagination if there's only one page or no data
  }

  // Handler for page changes
  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string | null) => {
    if (url && onPageChange) {
      e.preventDefault();
      onPageChange(url);
    }
  };

  // Get previous and next links
  const prevLink = meta.links.find(link => link.label === "&laquo; Previous");
  const nextLink = meta.links.find(link => link.label === "Next &raquo;");

  // Filter out numeric page links (exclude previous/next)
  const pageLinks = meta.links.filter(link => 
    !link.label.includes("Previous") && 
    !link.label.includes("Next")
  );

  let visiblePageLinks = [...pageLinks];
  const currentPageIndex = pageLinks.findIndex(link => link.active);
  
  if (pageLinks.length > 3) {
    let startIndex = Math.max(0, currentPageIndex - 1);
    let endIndex = Math.min(startIndex + 2, pageLinks.length - 1);
    
    if (endIndex === pageLinks.length - 1) {
      startIndex = Math.max(0, endIndex - 2);
    }
    
    visiblePageLinks = pageLinks.slice(startIndex, startIndex + 3);
  }

  // Determine if we need to show ellipsis
  const showStartEllipsis = visiblePageLinks[0]?.label !== "1";
  const showEndEllipsis = visiblePageLinks[visiblePageLinks.length - 1]?.label !== meta.last_page.toString();

  return (
    <Pagination className={className}>
      {/* Add a custom class to reduce the gap between items */}
      <PaginationContent className="gap-[0px] sm:gap-1">
        {/* Previous button */}
        <PaginationItem className='cursor-pointer'>
          <PaginationPrevious 
            // href={prevLink?.url || "#"} 
            onClick={(e) => prevLink?.url && handlePageClick(e, prevLink.url)}
            aria-disabled={!prevLink?.url}
            className={!prevLink?.url ? "pointer-events-none mr-4  bg-manduSecondary/40 text-white" : "bg-manduSecondary text-white"}
          />
        </PaginationItem>
        
        {/* Start ellipsis if needed */}
        {showStartEllipsis && (
          <PaginationItem className='cursor-pointer'>
            <PaginationLink 
              // href={pageLinks[0].url || "#"} 
              onClick={(e) => pageLinks[0].url && handlePageClick(e, pageLinks[0].url)}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}
        
        {showStartEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Visible page links (max 4) */}
        {visiblePageLinks.map((link, index) => (
          <PaginationItem key={index} className='cursor-pointer'>
            <PaginationLink 
              // href={link.url || "#"} 
              isActive={link.active}
              onClick={(e) => link.url && handlePageClick(e, link.url)}
              // Make the pagination links more compact
              className="h-8 w-8 p-0 sm:h-9 sm:w-9 text-manduCustom-secondary-blue"
            >
              {link.label}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {/* End ellipsis if needed */}
        {showEndEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
            
          </PaginationItem>
        )}
        
        {showEndEllipsis && (
          <PaginationItem className='cursor-pointer'>
            <PaginationLink 
              // href={pageLinks[pageLinks.length - 1].url || "#"} 
              onClick={(e) => pageLinks[pageLinks.length - 1].url && handlePageClick(e, pageLinks[pageLinks.length - 1].url)}
            >
              {meta.last_page}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Next button */}
        <PaginationItem className='cursor-pointer'>
          <PaginationNext 
            // href={nextLink?.url || "#"} 
            onClick={(e) => nextLink?.url && handlePageClick(e, nextLink.url)}
            aria-disabled={!nextLink?.url}
            className={!nextLink?.url ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DataNavigation;
