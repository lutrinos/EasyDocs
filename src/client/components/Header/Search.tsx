import { Search as SearchIcon } from 'lucide-preact'

export const Search = () => {
  return (
    <div class="search">
      <label class="input flex gap-md">
        <SearchIcon className="h-[1em]" />
        <input type="text" class="grow" placeholder="Search" />
      </label>
    </div>
  );
};
