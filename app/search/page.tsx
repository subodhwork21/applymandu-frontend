// app/search/page.js or app/search/page.tsx

import { Search } from "@/lib/algolia-search";

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Search />;
}
