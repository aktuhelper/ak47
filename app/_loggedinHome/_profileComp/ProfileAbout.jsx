import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { combinedColors } from "./profileHelpers";

export default function ProfileAbout({ profile }) {
    // Combine skills and interests for display (remove duplicates)
    const allSkillsInterests = [...new Set([...profile.skills, ...profile.interests])];

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-1 border-b border-border/50">
                <CardTitle className="text-xl font-semibold tracking-tight">About</CardTitle>
            </CardHeader>
            <CardContent className="pt-1 space-y-6">
                {profile.bio && (
                    <div className="relative">
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/60 to-primary/20 rounded-full" />
                        <p className="text-base text-foreground/90 leading-relaxed pl-4">
                            {profile.bio}
                        </p>
                    </div>
                )}

                {allSkillsInterests.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Skills & Interests
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allSkillsInterests.map((item, index) => (
                                <Badge
                                    key={`${item}-${index}`}
                                    className={`${combinedColors[index % combinedColors.length]} text-white border-0 px-3 py-1 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
                                >
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}