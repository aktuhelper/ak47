"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    Star,
    MessageCircle,
    MapPin,
    Calendar,
    GraduationCap,
    Code,
    Sparkles,
    Linkedin,
    Github,
    Globe,
    Twitter,
    Code2,
    Instagram,
    Award,
    Trophy,
    Target,
    Zap,
    ArrowLeft
} from "lucide-react";

// Mock profile data generator based on ID
const getProfileData = (id) => {
    return {
        id: id,
        userId: `user-${id}`,
        fullName: id === "101" ? "Prashant Kumar Singh" : `Senior User ${id}`,
        username: id === "101" ? "prashantks" : `user${id}`,
        bio: "Passionate about technology and innovation. Currently exploring AI/ML and full-stack development.",
        avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${id}`,
        bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
        isVerified: 1,
        isMentor: Math.random() > 0.5 ? 1 : 0,
        college: "IIT Delhi",
        branch: "Computer Science & Engineering",
        course: "B.Tech",
        year: 3,
        enrollmentYear: 2022,
        graduationYear: 2026,
        skills: ["C++", "Java", "DSA", "React", "TypeScript", "Node.js", "Python", "Docker"],
        interests: ["AI", "Startups", "Hackathons", "Web Development", "Open Source"],
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        portfolioUrl: "https://dev.to",
        twitterUrl: "https://twitter.com",
        leetcodeUrl: "https://leetcode.com",
        instagramUrl: "https://instagram.com",
        queriesAsked: 45,
        answersGiven: 128,
        helpfulCount: 256,
        totalViews: 12500,
    };
};

export default function UserProfilePage({ params }) {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = params?.id || "1";

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setProfile(getProfileData(userId));
            setLoading(false);
        }, 500);
    }, [userId]);

    const handleBack = () => {
        router.push("/seniormycollege");
    };

    const handleAskQuery = () => {
        alert(`Opening query modal for ${profile.fullName}`);
    };

    const getSeniorityBadge = (year, course) => {
        if (!year) return "Student";
        const isMBA = course?.toLowerCase().includes("mba");
        if (isMBA) return year === 1 ? "MBA-1st" : "MBA-2nd";
        switch (year) {
            case 1: return "Fresher";
            case 2: return "Junior";
            case 3: return "Senior";
            case 4: return "Super Senior";
            default: return "Student";
        }
    };

    const getYearSuffix = (year) => {
        if (year === 1) return "1st";
        if (year === 2) return "2nd";
        if (year === 3) return "3rd";
        return `${year}th`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-theme-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) return <div>User not found</div>;

    const socialLinks = [
        { name: "LinkedIn", icon: Linkedin, url: profile.linkedinUrl, color: "text-[#0A66C2]", bgColor: "bg-[#0A66C2]/10" },
        { name: "GitHub", icon: Github, url: profile.githubUrl, color: "text-gray-900 dark:text-white", bgColor: "bg-gray-100 dark:bg-zinc-800" },
        { name: "Portfolio", icon: Globe, url: profile.portfolioUrl, color: "text-purple-500", bgColor: "bg-purple-500/10" },
        { name: "Twitter", icon: Twitter, url: profile.twitterUrl, color: "text-[#1DA1F2]", bgColor: "bg-[#1DA1F2]/10" },
        { name: "LeetCode", icon: Code2, url: profile.leetcodeUrl, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    ].filter(link => link.url);

    const badges = [];
    if (profile.year) {
        badges.push({
            id: "year-badge",
            name: getSeniorityBadge(profile.year, profile.course),
            description: `${getYearSuffix(profile.year)} Year`,
            icon: Trophy,
            gradient: "from-purple-500 to-pink-500"
        });
    }
    if (profile.isMentor) {
        badges.push({
            id: "mentor",
            name: "Mentor",
            description: "Helping students",
            icon: Star,
            gradient: "from-rose-500 to-red-600"
        });
    }
    if (profile.isVerified) {
        badges.push({
            id: "verified",
            name: "Verified",
            description: "Verified user",
            icon: CheckCircle2,
            gradient: "from-blue-500 to-indigo-600"
        });
    }

    return (
        <div className="min-h-screen bg-theme-secondary transition-colors duration-300">
            {/* Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-theme px-3 py-2">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-base font-semibold">Profile</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-3 md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
                        <Card className="overflow-hidden card-theme border-none shadow-md">
                            {/* Banner */}
                            <div
                                className="h-20 w-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${profile.bannerUrl})` }}
                            />

                            <CardContent className="pt-0 pb-4 px-4 relative">
                                {/* Avatar */}
                                <div className="flex justify-center -mt-10 mb-3">
                                    <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-zinc-900 shadow-lg">
                                        <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                                        <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                                            {profile.fullName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Name & Bio */}
                                <div className="text-center space-y-3">
                                    <div>
                                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                            <h2 className="text-lg font-bold text-theme-primary">{profile.fullName}</h2>
                                            {profile.isVerified === 1 && (
                                                <CheckCircle2 className="w-4 h-4 text-blue-500" fill="currentColor" color="white" />
                                            )}
                                        </div>
                                        <p className="text-sm text-theme-secondary">@{profile.username}</p>
                                    </div>

                                    <p className="text-theme-secondary text-xs leading-relaxed">
                                        {profile.bio}
                                    </p>

                                    {/* CTA Button */}
                                    <Button
                                        className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm"
                                        onClick={handleAskQuery}
                                    >
                                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                        Ask a Query
                                    </Button>

                                    {/* Social Links */}
                                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-2 rounded-full transition-all duration-300 hover:-translate-y-0.5 ${link.bgColor} ${link.color}`}
                                                title={link.name}
                                            >
                                                <link.icon className="w-4 h-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Right Content Area */}
                    <main className="lg:col-span-8 xl:col-span-9 space-y-4">
                        {/* Badges Section */}
                        {badges.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`relative overflow-hidden rounded-lg p-3 bg-gradient-to-br ${badge.gradient} text-white shadow-md transition-transform hover:scale-[1.02] duration-300`}
                                    >
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <badge.icon className="w-12 h-12" />
                                        </div>
                                        <div className="relative z-10 flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                                                <badge.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm">{badge.name}</h3>
                                                <p className="text-white/90 text-xs">{badge.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Details Card */}
                        <Card className="card-theme border-none shadow-md">
                            <CardContent className="p-4">
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center gap-2.5 text-theme-secondary">
                                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-theme-primary text-xs">{profile.course} • {profile.branch}</p>
                                            <p className="text-[10px]">{profile.college}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-theme-secondary">
                                        <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-theme-primary text-xs">Class of {profile.graduationYear}</p>
                                            <p className="text-[10px]">{getSeniorityBadge(profile.year, profile.course)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-theme-secondary">
                                        <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                            <MapPin className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-theme-primary text-xs">New Delhi, India</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills & Interests Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Skills */}
                            <Card className="card-theme border-none shadow-md h-full">
                                <div className="p-3 border-b border-theme flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        <Code className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-sm text-theme-primary">Skills & Tech Stack</h3>
                                </div>
                                <CardContent className="p-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Interests */}
                            <Card className="card-theme border-none shadow-md h-full">
                                <div className="p-3 border-b border-theme flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-sm text-theme-primary">Interests & Hobbies</h3>
                                </div>
                                <CardContent className="p-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.interests.map((interest, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Stats Card */}
                        <Card className="card-theme border-none shadow-md">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="space-y-0.5">
                                        <p className="text-xl font-bold text-theme-primary">{profile.queriesAsked}</p>
                                        <p className="text-[10px] text-theme-muted uppercase tracking-wider font-medium">Queries</p>
                                    </div>
                                    <div className="space-y-0.5 border-x border-theme">
                                        <p className="text-xl font-bold text-theme-primary">{profile.answersGiven}</p>
                                        <p className="text-[10px] text-theme-muted uppercase tracking-wider font-medium">Answers</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xl font-bold text-theme-primary">{profile.helpfulCount}</p>
                                        <p className="text-[10px] text-theme-muted uppercase tracking-wider font-medium">Helped</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}