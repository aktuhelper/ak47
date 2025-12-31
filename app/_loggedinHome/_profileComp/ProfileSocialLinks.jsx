import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Linkedin,
    Github,
    Globe,
    Twitter,
    Code2,
    Instagram,
    Link2
} from "lucide-react";

export default function ProfileSocialLinks({ profile }) {
    // Social links configuration
    const socialLinks = [
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: profile.linkedinUrl,
            color: "text-[#0A66C2]",
            bgColor: "bg-[#0A66C2]/10",
            hoverBg: "hover:bg-[#0A66C2]/20",
        },
        {
            name: "GitHub",
            icon: Github,
            url: profile.githubUrl,
            color: "text-foreground",
            bgColor: "bg-muted",
            hoverBg: "hover:bg-muted/80",
        },
        {
            name: "Portfolio",
            icon: Globe,
            url: profile.portfolioUrl,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            hoverBg: "hover:bg-purple-500/20",
        },
        {
            name: "Twitter",
            icon: Twitter,
            url: profile.twitterUrl,
            color: "text-[#1DA1F2]",
            bgColor: "bg-[#1DA1F2]/10",
            hoverBg: "hover:bg-[#1DA1F2]/20",
        },
        {
            name: "LeetCode",
            icon: Code2,
            url: profile.leetcodeUrl,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            hoverBg: "hover:bg-orange-500/20",
        },
        {
            name: "Instagram",
            icon: Instagram,
            url: profile.instagramUrl,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
            hoverBg: "hover:bg-pink-500/20",
        },
    ].filter(link => link.url && link.url.trim() !== '');

    // Only render if there are social links to show
    if (socialLinks.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Connect
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {socialLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                            className={`group flex flex-col items-center gap-2 p-3 rounded-lg ${link.bgColor} ${link.hoverBg} transition-all hover:scale-105`}
                            aria-label={`Visit ${link.name}`}
                        >
                            <link.icon className={`w-6 h-6 ${link.color}`} />
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {link.name}
                            </span>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}