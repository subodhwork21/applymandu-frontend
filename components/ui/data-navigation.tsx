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

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious 
            href={prevLink?.url || "#"} 
            onClick={(e) => prevLink?.url && handlePageClick(e, prevLink.url)}
            aria-disabled={!prevLink?.url}
            className={!prevLink?.url ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {/* Page links */}
        {pageLinks.map((link, index) => (
          <PaginationItem key={index}>
            <PaginationLink 
              href={link.url || "#"} 
              isActive={link.active}
              onClick={(e) => link.url && handlePageClick(e, link.url)}
            >
              {link.label}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {/* Show ellipsis only if there are more than displayed pages */}
        {meta.last_page > meta.links.length - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {/* Next button */}
        <PaginationItem>
          <PaginationNext 
            href={nextLink?.url || "#"} 
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