import React from "react";

export default function CollegeSelector({
    collegeSearch,
    selectedCollege,
    manualCollege,
    showCollegeDropdown,
    filteredColleges,
    onSearchChange,
    onCollegeSelect,
    onManualCollegeChange,
    onFocus,
    onDropdownToggle
}) {
    const dropdownRef = React.useRef(null);

    // Auto-scroll to top when filtered colleges change
    React.useEffect(() => {
        if (dropdownRef.current && showCollegeDropdown) {
            dropdownRef.current.scrollTop = 0;
        }
    }, [filteredColleges, showCollegeDropdown]);

    return (
        <>
            <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    College
                </label>
                <input
                    type="text"
                    placeholder="Search college..."
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm cursor-text"
                    value={selectedCollege && selectedCollege !== "Other" ? selectedCollege : collegeSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={onFocus}
                />
                {showCollegeDropdown && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-40 overflow-y-auto z-10 custom-scrollbar"
                    >
                        <div
                            className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer text-xs font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-zinc-700 transition-colors bg-white dark:bg-zinc-900"
                            onClick={() => {
                                onCollegeSelect("Other");
                            }}
                        >
                            ✏️ Other (Enter manually)
                        </div>

                        {filteredColleges.length > 0 ? (
                            <>
                                <div className="px-3 py-1 text-xs text-gray-400 dark:text-zinc-600 bg-gray-50 dark:bg-zinc-800/50">
                                    {filteredColleges.length} colleges found
                                </div>
                                {[...new Set(filteredColleges)].map((col) => (
                                    <div
                                        key={col}
                                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer text-xs text-gray-700 dark:text-zinc-300 transition-colors"
                                        onClick={() => {
                                            onCollegeSelect(col);
                                        }}
                                    >
                                        {col}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-zinc-500 text-center">
                                No colleges found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedCollege === "Other" && (
                <div className="animate-slideIn">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                        Enter Your College Name
                    </label>
                    <input
                        type="text"
                        placeholder="Type your college name..."
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm"
                        value={manualCollege}
                        onChange={(e) => onManualCollegeChange(e.target.value)}
                        autoFocus
                    />
                </div>
            )}
        </>
    );
}