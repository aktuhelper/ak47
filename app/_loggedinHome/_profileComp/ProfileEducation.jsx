import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { extractYearNumber, getYearSuffix } from "./profileHelpers.js";

export default function ProfileEducation({ profile }) {
    // Helper to format year display
    const formatYearDisplay = (year) => {
        if (!year) return "N/A";

        // Check if it's "Passout" (case-insensitive)
        if (String(year).toLowerCase() === 'passout') {
            return "Passed Out";
        }

        // Extract year number and format with suffix
        const yearNum = extractYearNumber(year);
        if (!yearNum) return "N/A";

        return `${getYearSuffix(yearNum)} Year`;
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">College</span>
                        <span className="font-medium text-right">{profile.college || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Branch</span>
                        <span className="font-medium text-right">{profile.branch || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Course</span>
                        <span className="font-medium text-right">{profile.course || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium text-right">
                            {formatYearDisplay(profile.year)}
                        </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Graduation</span>
                        <span className="font-medium text-right">{profile.graduationYear || "N/A"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}