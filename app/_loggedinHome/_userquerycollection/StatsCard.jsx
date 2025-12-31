// components/StatsCard.jsx
export default function StatsCard({ label, value, valueColor = "font-bold text-zinc-900 dark:text-zinc-100", icon }) {
    return (
        <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
            <p className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                {label}
            </p>
            <p className={`text-2xl sm:text-3xl font-extrabold ${valueColor} tracking-tight`}>
                {value}
            </p>
        </div>
    );
}