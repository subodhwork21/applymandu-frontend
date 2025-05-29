'use client';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
  SearchBox,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

const searchClient = algoliasearch('M1QH4KFLC3', '614ac0eda2dec1473696160d8051957b');

export function Search() {
  return (
  <InstantSearchNext indexName="YourIndexName" searchClient={searchClient}>
      <SearchBox />
      {/* other widgets */}
   </InstantSearchNext>
  );
}
