// components/SortDropdown.jsx
export default function SortDropdown({ sortBy, setSortBy }) {
    return (
        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-answered">Most Answered</option>
            <option value="most-viewed">Most Viewed</option>
        </select>
    );
}