import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    CheckCircle2,
    Star,
    Pencil,
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
    Link2,
    Award,
    Trophy,
    Target,
    Zap,
    X,
} from "lucide-react";
;

export default function CompleteProfilePage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // TODO: remove mock functionality - this is mock data for the prototype
    const [profile, setProfile] = useState({
        id: "1",
        userId: "user-1",
        fullName: "Alex Morgan",
        username: "alexmorgan",
        bio: "Passionate about technology and innovation. Currently exploring AI/ML and full-stack development. Love participating in hackathons and building projects that make a difference. Always eager to learn new technologies and collaborate with talented individuals.",
        avatarUrl: '/logo_192.png',
        bannerUrl: '/banner.jpeg',
        isVerified: 1,
        isMentor: 1,
        college: "Massachusetts Institute of Technology",
        branch: "Computer Science & Engineering",
        course: "B.Tech",
        year: 3,
        enrollmentYear: 2022,
        graduationYear: 2026,
        skills: ["C++", "Java", "DSA", "React", "TypeScript", "Node.js", "Python", "Docker"],
        interests: ["AI", "Startups", "Hackathons", "College Clubs", "Web Development", "Open Source"],
        linkedinUrl: "https://linkedin.com/in/alexmorgan",
        githubUrl: "https://github.com/alexmorgan",
        portfolioUrl: "https://alexmorgan.dev",
        twitterUrl: "https://twitter.com/alexmorgan",
        leetcodeUrl: "https://leetcode.com/alexmorgan",
        instagramUrl: "https://instagram.com/alexmorgan",
        queriesAsked: 45,
        answersGiven: 128,
        helpfulCount: 256,
        totalViews: 12500,
    });

    const [formData, setFormData] = useState({
        fullName: profile.fullName,
        bio: profile.bio || "",
        college: profile.college || "",
        branch: profile.branch || "",
        course: profile.course || "",
        year: profile.year || 1,
        enrollmentYear: profile.enrollmentYear || new Date().getFullYear(),
        graduationYear: profile.graduationYear || new Date().getFullYear() + 4,
        skills: profile.skills || [],
        interests: profile.interests || [],
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        twitterUrl: profile.twitterUrl || "",
        leetcodeUrl: profile.leetcodeUrl || "",
        instagramUrl: profile.instagramUrl || "",
    });

    const [newSkill, setNewSkill] = useState("");
    const [newInterest, setNewInterest] = useState("");

    const isOwner = true; // TODO: remove mock functionality

    // Helper functions
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

    const getSeniorityGradient = (badge) => {
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

    const getYearSuffix = (year) => {
        if (year === 1) return "1st";
        if (year === 2) return "2nd";
        if (year === 3) return "3rd";
        return `${year}th`;
    };

    const formatBadgeText = () => {
        if (!profile.year) return getSeniorityBadge(profile.year, profile.course);
        const isMBA = profile.course?.toLowerCase().includes("mba");
        const badge = getSeniorityBadge(profile.year, profile.course);
        if (isMBA) return `${badge.split('-')[0]} • ${getYearSuffix(profile.year)} Year`;
        return `${badge} • ${getYearSuffix(profile.year)} Year`;
    };

    // Event handlers
    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = () => {
        console.log("Saving profile:", formData);
        setProfile({ ...profile, ...formData });
        setIsEditModalOpen(false);
    };

    const handleAskDoubt = () => {
        alert("This would navigate to messaging or doubt submission!");
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] });
            setNewInterest("");
        }
    };

    const handleRemoveInterest = (interest) => {
        setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    };

    const seniorityBadge = getSeniorityBadge(profile.year, profile.course);

    const skillColors = [
        "bg-gradient-to-r from-blue-500 to-cyan-500",
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "bg-gradient-to-r from-green-500 to-emerald-500",
        "bg-gradient-to-r from-orange-500 to-red-500",
    ];

    const interestColors = [
        "bg-gradient-to-r from-violet-400 to-purple-400",
        "bg-gradient-to-r from-pink-400 to-rose-400",
        "bg-gradient-to-r from-cyan-400 to-blue-400",
        "bg-gradient-to-r from-amber-400 to-yellow-400",
    ];

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
    ].filter(link => link.url);

    // Badges data
    const badges = [];

    if (profile.year) {
        const isMBA = profile.course?.toLowerCase().includes("mba");
        if (isMBA) {
            badges.push({
                id: `mba-${profile.year}`,
                name: "MBA",
                description: `${getYearSuffix(profile.year)} Year`,
                icon: Trophy,
                gradient: "from-yellow-500 to-amber-500",
                earnedDate: "2024"
            });
        } else {
            const badgeMap = {
                1: { id: "fresher", name: "Fresher", icon: Target, gradient: "from-emerald-500 to-teal-500", earnedDate: "2024" },
                2: { id: "junior", name: "Junior", icon: Zap, gradient: "from-blue-500 to-cyan-500", earnedDate: "2023" },
                3: { id: "senior", name: "Senior", icon: Award, gradient: "from-purple-500 to-pink-500", earnedDate: "2022" },
                4: { id: "super-senior", name: "Super Senior", icon: Trophy, gradient: "from-orange-500 to-red-500", earnedDate: "2021" },
            };
            if (badgeMap[profile.year]) {
                badges.push({ ...badgeMap[profile.year], description: `${getYearSuffix(profile.year)} Year` });
            }
        }
    }

    if (profile.isMentor === 1) {
        badges.push({
            id: "mentor",
            name: "Mentor",
            description: "Helping students",
            icon: Star,
            gradient: "from-rose-500 to-red-600",
            earnedDate: "2024"
        });
    }

    if (profile.isVerified === 1) {
        badges.push({
            id: "verified",
            name: "Verified",
            description: "Verified user",
            icon: CheckCircle2,
            gradient: "from-blue-500 to-indigo-600",
            earnedDate: "2024"
        });
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Profile */}
                    <aside className="lg:col-span-3">
                        <div className="lg:sticky lg:top-6 space-y-4">
                            {/* Main Profile Card */}
                            <Card className="overflow-hidden">
                                {/* Banner */}
                                <div
                                    className="h-24 w-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black"
                                    style={{
                                        backgroundImage: profile.bannerUrl ? `url(${profile.bannerUrl})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />

                                <CardContent className="pt-0 pb-6">
                                    {/* Avatar */}
                                    <div className="flex justify-center -mt-12 mb-4">
                                        <Avatar className="w-24 h-24 ring-4 ring-background border-2 border-primary/20">
                                            <AvatarImage src={profile.avatarUrl || undefined} alt={profile.fullName} />
                                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-chart-3">
                                                {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Name and Verification */}
                                    <div className="text-center space-y-3 mb-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <h2 className="text-xl font-bold">{profile.fullName}</h2>
                                            {profile.isVerified === 1 && (
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            )}
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-col items-center gap-2">
                                            <Badge
                                                className={`bg-gradient-to-r ${getSeniorityGradient(seniorityBadge)} text-white border-0 px-4 py-1.5 text-xs font-semibold`}
                                            >
                                                {formatBadgeText()}
                                            </Badge>

                                            {profile.isMentor === 1 && (
                                                <Badge
                                                    className="bg-gradient-to-r from-rose-500 to-red-600 text-white border-0 px-4 py-1.5 text-xs font-semibold"
                                                >
                                                    <Star className="w-3 h-3 mr-1.5 fill-white" />
                                                    Mentor
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {profile.bio && (
                                        <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
                                            {profile.bio}
                                        </p>
                                    )}

                                    {/* Quick Info */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        {profile.college && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{profile.college}</span>
                                            </div>
                                        )}
                                        {profile.branch && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{profile.branch}</span>
                                            </div>
                                        )}
                                        {profile.graduationYear && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span>Graduating {profile.graduationYear}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        {isOwner && (
                                            <Button
                                                onClick={handleEditProfile}
                                                variant="outline"
                                                className="w-full gap-2"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit Profile
                                            </Button>
                                        )}

                                        {!isOwner && profile.isMentor === 1 && (
                                            <Button
                                                onClick={handleAskDoubt}
                                                className="w-full gap-2"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Ask a Doubt
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{profile.queriesAsked || 0}</div>
                                            <div className="text-xs text-muted-foreground">Queries</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-chart-2">{profile.answersGiven || 0}</div>
                                            <div className="text-xs text-muted-foreground">Answers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-chart-3">{profile.helpfulCount || 0}</div>
                                            <div className="text-xs text-muted-foreground">Helpful</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-chart-4">{(profile.totalViews || 0).toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">Views</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-4">
                        {/* About Section */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {profile.bio && (
                                    <div>
                                        <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
                                    </div>
                                )}

                                {profile.skills && profile.skills.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Code className="w-3.5 h-3.5" />
                                            Skills
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.skills.map((skill, index) => (
                                                <Badge
                                                    key={skill}
                                                    className={`${skillColors[index % skillColors.length]} text-white border-0 px-2.5 py-0.5 text-xs`}
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {profile.interests && profile.interests.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Interests
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.interests.map((interest, index) => (
                                                <Badge
                                                    key={interest}
                                                    className={`${interestColors[index % interestColors.length]} text-white border-0 px-2.5 py-0.5 text-xs`}
                                                >
                                                    {interest}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Academic Details */}
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
                                            <span className="font-medium text-right">{profile.year ? `${getYearSuffix(profile.year)} Year` : "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-muted-foreground">Graduation</span>
                                            <span className="font-medium text-right">{profile.graduationYear || "N/A"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Achievements/Badges */}
                            {badges.length > 0 && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <Award className="w-4 h-4" />
                                            Achievements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {badges.map((badge) => (
                                                <div
                                                    key={badge.id}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border hover-elevate transition-all"
                                                >
                                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center flex-shrink-0`}>
                                                        <badge.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold">{badge.name}</div>
                                                        <div className="text-xs text-muted-foreground">{badge.description}</div>
                                                    </div>
                                                    {badge.earnedDate && (
                                                        <div className="text-xs text-muted-foreground">{badge.earnedDate}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <Link2 className="w-4 h-4" />
                                        Connect
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                        {socialLinks.map((link) => (
                                            <button
                                                key={link.name}
                                                onClick={() => window.open(link.url, '_blank')}
                                                className={`group flex flex-col items-center gap-2 p-3 rounded-lg ${link.bgColor} ${link.hoverBg} transition-all hover:scale-105`}
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
                        )}
                    </main>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself (max 300 characters)"
                                    maxLength={300}
                                    className="resize-none"
                                    rows={3}
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                    {formData.bio.length}/300 characters
                                </div>
                            </div>
                        </div>

                        {/* Academic Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Academic Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="college">College</Label>
                                    <Input
                                        id="college"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="branch">Branch</Label>
                                    <Input
                                        id="branch"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="course">Course</Label>
                                    <Input
                                        id="course"
                                        value={formData.course}
                                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                        placeholder="e.g., B.Tech, MBA"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="year">Year</Label>
                                    <Select
                                        value={formData.year.toString()}
                                        onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                                    >
                                        <SelectTrigger id="year">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                                    <Input
                                        id="enrollmentYear"
                                        type="number"
                                        value={formData.enrollmentYear}
                                        onChange={(e) => setFormData({ ...formData, enrollmentYear: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="graduationYear">Graduation Year</Label>
                                    <Input
                                        id="graduationYear"
                                        type="number"
                                        value={formData.graduationYear}
                                        onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <Label>Skills</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                    placeholder="Add a skill"
                                />
                                <Button onClick={handleAddSkill} type="button">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill) => (
                                    <Badge key={skill} className="gap-1">
                                        {skill}
                                        <X className="w-3 h-3 cursor-pointer hover-elevate" onClick={() => handleRemoveSkill(skill)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-3">
                            <Label>Interests</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                                    placeholder="Add an interest"
                                />
                                <Button onClick={handleAddInterest} type="button">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.interests.map((interest) => (
                                    <Badge key={interest} className="gap-1">
                                        {interest}
                                        <X className="w-3 h-3 cursor-pointer hover-elevate" onClick={() => handleRemoveInterest(interest)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Social Links</h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                                    <Input
                                        id="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="githubUrl">GitHub</Label>
                                    <Input
                                        id="githubUrl"
                                        value={formData.githubUrl}
                                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                        placeholder="https://github.com/username"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="portfolioUrl">Portfolio</Label>
                                    <Input
                                        id="portfolioUrl"
                                        value={formData.portfolioUrl}
                                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="twitterUrl">Twitter</Label>
                                    <Input
                                        id="twitterUrl"
                                        value={formData.twitterUrl}
                                        onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                                        placeholder="https://twitter.com/username"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="leetcodeUrl">LeetCode</Label>
                                    <Input
                                        id="leetcodeUrl"
                                        value={formData.leetcodeUrl}
                                        onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                                        placeholder="https://leetcode.com/username"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="instagramUrl">Instagram</Label>
                                    <Input
                                        id="instagramUrl"
                                        value={formData.instagramUrl}
                                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                        placeholder="https://instagram.com/username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
