export const extractYearNumber = (year) => {
    if (!year) return null;
    if (typeof year === 'number') return year;
    const match = String(year).match(/\d+/);
    return match ? parseInt(match[0]) : null;
};
export const getYearSuffix = (year) => {
    const yearNum = extractYearNumber(year);
    if (!yearNum) return "";

    if (yearNum === 1) return "1st";
    if (yearNum === 2) return "2nd";
    if (yearNum === 3) return "3rd";
    return `${yearNum}th`;
};
export const getSeniorityBadge = (year, course) => {
    if (!year) return "Student";

    const isMBA = course?.toLowerCase().includes("mba");
    const yearNum = extractYearNumber(year);

    if (!yearNum) return "Student";

    if (isMBA) {
        return yearNum === 1 ? "MBA-1st" : "MBA-2nd";
    }

    switch (yearNum) {
        case 1: return "Fresher";
        case 2: return "Junior";
        case 3: return "Senior";
        case 4: return "Super Senior";
        default: return "Student";
    }
};
export const getSeniorityGradient = (badge) => {
    switch (badge) {
        case "Fresher": return "from-emerald-500 to-teal-500";
        case "Junior": return "from-blue-500 to-cyan-500";
        case "Senior": return "from-purple-500 to-pink-500";
        case "Super Senior": return "from-orange-500 to-red-500";
        case "MBA-1st":
        case "MBA-2nd": return "from-yellow-500 to-amber-500";
        default: return "from-gray-500 to-slate-500";
    }
};
export const formatBadgeText = (year, course) => {
    if (!year) return getSeniorityBadge(year, course);

    const isMBA = course?.toLowerCase().includes("mba");
    const badge = getSeniorityBadge(year, course);
    const yearNum = extractYearNumber(year);

    if (!yearNum) return badge;

    if (isMBA) {
        return `${badge.split('-')[0]} • ${getYearSuffix(yearNum)} Year`;
    }
    return `${badge} • ${getYearSuffix(yearNum)} Year`;
};
export const skillColors = [
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
];

export const interestColors = [
    "bg-gradient-to-r from-violet-400 to-purple-400",
    "bg-gradient-to-r from-pink-400 to-rose-400",
    "bg-gradient-to-r from-cyan-400 to-blue-400",
    "bg-gradient-to-r from-amber-400 to-yellow-400",
];
export const combinedColors = [...skillColors, ...interestColors];