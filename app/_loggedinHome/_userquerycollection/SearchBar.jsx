// components/SearchBar.jsx
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <input
                    type="search"
                    placeholder="Search your queries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}