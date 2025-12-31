import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X } from "lucide-react";
import toast from 'react-hot-toast';
import { updateUserProfile, uploadImageToStrapi, uploadBannerToStrapi } from "@/app/utility/api";

export default function EditProfileModal({
    isOpen,
    onClose,
    profile,
    userData,
    onProfileUpdated
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newInterest, setNewInterest] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const [formData, setFormData] = useState({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        college: profile.college || "",
        branch: profile.branch || "",
        course: profile.course || "",
        year: profile.year || "1st Year",
        enrollmentYear: profile.enrollmentYear || new Date().getFullYear(),
        graduationYear: profile.graduationYear || new Date().getFullYear() + 4,
        skills: Array.isArray(profile.skills) ? [...profile.skills] : [],
        interests: Array.isArray(profile.interests) ? [...profile.interests] : [],
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        twitterUrl: profile.twitterUrl || "",
        leetcodeUrl: profile.leetcodeUrl || "",
        instagramUrl: profile.instagramUrl || "",
        avatarUrl: profile.avatarUrl || "",
        bannerUrl: profile.bannerUrl || "",
        avatarFile: null,
        bannerFile: null,
    });

    // Reset form when profile changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                fullName: profile.fullName || "",
                bio: profile.bio || "",
                college: profile.college || "",
                branch: profile.branch || "",
                course: profile.course || "",
                year: profile.year || "1st Year",
                enrollmentYear: profile.enrollmentYear || new Date().getFullYear(),
                graduationYear: profile.graduationYear || new Date().getFullYear() + 4,
                skills: Array.isArray(profile.skills) ? [...profile.skills] : [],
                interests: Array.isArray(profile.interests) ? [...profile.interests] : [],
                linkedinUrl: profile.linkedinUrl || "",
                githubUrl: profile.githubUrl || "",
                portfolioUrl: profile.portfolioUrl || "",
                twitterUrl: profile.twitterUrl || "",
                leetcodeUrl: profile.leetcodeUrl || "",
                instagramUrl: profile.instagramUrl || "",
                avatarUrl: profile.avatarUrl || "",
                bannerUrl: profile.bannerUrl || "",
                avatarFile: null,
                bannerFile: null,
            });
            setAvatarPreview(null);
            setBannerPreview(null);
            setNewSkill("");
            setNewInterest("");
        }
    }, [isOpen, profile]);

    // Avatar handling
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setFormData({ ...formData, avatarFile: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.onerror = () => {
            toast.error('Error reading file');
        };
        reader.readAsDataURL(file);
    };

    // Banner handling
    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setFormData({ ...formData, bannerFile: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerPreview(reader.result);
        };
        reader.onerror = () => {
            toast.error('Error reading file');
        };
        reader.readAsDataURL(file);
    };

    // Skills management
    const handleAddSkill = () => {
        const trimmedSkill = newSkill.trim();

        if (!trimmedSkill) return;

        if (formData.skills.includes(trimmedSkill)) {
            toast.error('This skill already exists');
            return;
        }

        if (formData.skills.length >= 20) {
            toast.error('Maximum 20 skills allowed');
            return;
        }

        setFormData({ ...formData, skills: [...formData.skills, trimmedSkill] });
        setNewSkill("");
        toast.success('Skill added');
    };

    const handleRemoveSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skill)
        });
    };

    // Interests management
    const handleAddInterest = () => {
        const trimmedInterest = newInterest.trim();

        if (!trimmedInterest) return;

        if (formData.interests.includes(trimmedInterest)) {
            toast.error('This interest already exists');
            return;
        }

        if (formData.interests.length >= 20) {
            toast.error('Maximum 20 interests allowed');
            return;
        }

        setFormData({
            ...formData,
            interests: [...formData.interests, trimmedInterest]
        });
        setNewInterest("");
        toast.success('Interest added');
    };

    const handleRemoveInterest = (interest) => {
        setFormData({
            ...formData,
            interests: formData.interests.filter(i => i !== interest)
        });
    };

    // Save profile
    const handleSaveProfile = async () => {
        if (!formData.fullName.trim()) {
            toast.error('Please enter your full name');
            return;
        }

        if (formData.bio.length > 300) {
            toast.error('Bio must be 300 characters or less');
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading('Saving profile...');

        try {
            let newAvatarUrl = formData.avatarUrl;
            let newAvatarId = null;
            let newBannerUrl = formData.bannerUrl;

            // Upload profile picture
            if (formData.avatarFile) {
                try {
                    const uploadedAvatar = await uploadImageToStrapi(
                        formData.avatarFile,
                        'profilePic',
                        userData.documentId
                    );
                    if (uploadedAvatar?.id) {
                        newAvatarId = uploadedAvatar.id;
                        newAvatarUrl = uploadedAvatar.url;
                    }
                } catch (uploadError) {
                    console.error('Avatar upload failed:', uploadError);
                    toast.error('Failed to upload profile picture. Continuing with other updates...', {
                        id: loadingToast,
                    });
                }
            }

            // Upload banner
            if (formData.bannerFile) {
                try {
                    const uploadedBanner = await uploadBannerToStrapi(formData.bannerFile);
                    if (uploadedBanner?.url) {
                        newBannerUrl = uploadedBanner.url;
                    }
                } catch (uploadError) {
                    console.error('Banner upload failed:', uploadError);
                    toast.error('Failed to upload banner. Continuing with other updates...', {
                        id: loadingToast,
                    });
                }
            }

            // Prepare the data to send
            const dataToSend = {
                name: formData.fullName.trim(),
                bio: formData.bio.trim(),
                college: formData.college.trim(),
                branch: formData.branch.trim(),
                course: formData.course.trim(),
                year: formData.year,
                enrollmentYear: parseInt(formData.enrollmentYear) || new Date().getFullYear(),
                graduationYear: parseInt(formData.graduationYear) || new Date().getFullYear() + 4,
                interests: [...new Set([...formData.skills, ...formData.interests])],
                linkedinUrl: formData.linkedinUrl.trim(),
                githubUrl: formData.githubUrl.trim(),
                portfolioUrl: formData.portfolioUrl.trim(),
                twitterUrl: formData.twitterUrl.trim(),
                leetcodeUrl: formData.leetcodeUrl.trim(),
                instagramUrl: formData.instagramUrl.trim(),
                bannerUrl: newBannerUrl,
            };

            if (newAvatarId) {
                dataToSend.profileImage = newAvatarId;
            }

            // Update profile via API
            await updateUserProfile(userData.documentId, dataToSend);

            toast.success('Profile updated successfully!', {
                id: loadingToast,
            });

            // Notify parent and close
            if (onProfileUpdated) {
                await onProfileUpdated();
            }

            onClose();

        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error(`Failed to save profile: ${error.message || 'Unknown error occurred'}`, {
                id: loadingToast,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Profile Images Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Profile Images</h3>

                        {/* Banner Upload */}
                        <div className="space-y-2">
                            <Label>Banner Image</Label>
                            <div className="relative">
                                <div
                                    className="h-32 w-full rounded-lg bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black overflow-hidden"
                                    style={{
                                        backgroundImage: (bannerPreview || formData.bannerUrl) ? `url(${bannerPreview || formData.bannerUrl})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <label
                                        htmlFor="banner-upload"
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-white">
                                            <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-medium">Change Banner</span>
                                        </div>
                                    </label>
                                    <input
                                        id="banner-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerChange}
                                        className="hidden"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Recommended: 1500x500px, JPG or PNG, max 5MB
                            </p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <Label>Profile Picture</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 ring-2 ring-border">
                                        <AvatarImage src={avatarPreview || formData.avatarUrl || undefined} alt="Profile" />
                                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-chart-3">
                                            {formData.fullName
                                                ? formData.fullName.split(' ')
                                                    .map(n => n[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()
                                                : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer group"
                                    >
                                        <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="avatar-upload"
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm">Upload Photo</span>
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Square image recommended, max 5MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                disabled={isSaving}
                                required
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
                                disabled={isSaving}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                                {formData.bio.length}/300 characters
                            </div>
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Academic Details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="college">College</Label>
                                <Input
                                    id="college"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <Label htmlFor="branch">Branch</Label>
                                <Input
                                    id="branch"
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <Label htmlFor="course">Course</Label>
                                <Input
                                    id="course"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    placeholder="e.g., B.Tech, MBA"
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <Label htmlFor="year">Year</Label>
                                <Select
                                    value={formData.year}
                                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                                    disabled={isSaving}
                                >
                                    <SelectTrigger id="year">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st Year">1st Year</SelectItem>
                                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                                        <SelectItem value="4th Year">4th Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                                <Input
                                    id="enrollmentYear"
                                    type="number"
                                    value={formData.enrollmentYear}
                                    onChange={(e) => setFormData({ ...formData, enrollmentYear: parseInt(e.target.value) || new Date().getFullYear() })}
                                    disabled={isSaving}
                                    min="1900"
                                    max={new Date().getFullYear() + 10}
                                />
                            </div>

                            <div>
                                <Label htmlFor="graduationYear">Graduation Year</Label>
                                <Input
                                    id="graduationYear"
                                    type="number"
                                    value={formData.graduationYear}
                                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || new Date().getFullYear() + 4 })}
                                    disabled={isSaving}
                                    min="1900"
                                    max={new Date().getFullYear() + 20}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="space-y-3">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddSkill();
                                    }
                                }}
                                placeholder="Add a skill"
                                disabled={isSaving}
                            />
                            <Button
                                onClick={handleAddSkill}
                                type="button"
                                disabled={isSaving || !newSkill.trim()}
                            >
                                Add
                            </Button>
                        </div>
                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge key={`skill-${index}`} className="gap-1 pr-1">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleRemoveSkill(skill);
                                            }}
                                            disabled={isSaving}
                                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={`Remove ${skill}`}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="space-y-3">
                        <Label>Interests</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddInterest();
                                    }
                                }}
                                placeholder="Add an interest"
                                disabled={isSaving}
                            />
                            <Button
                                onClick={handleAddInterest}
                                type="button"
                                disabled={isSaving || !newInterest.trim()}
                            >
                                Add
                            </Button>
                        </div>
                        {formData.interests.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.interests.map((interest, index) => (
                                    <Badge key={`interest-${index}`} className="gap-1 pr-1">
                                        {interest}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleRemoveInterest(interest);
                                            }}
                                            disabled={isSaving}
                                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={`Remove ${interest}`}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
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
                                    disabled={isSaving}
                                    type="url"
                                />
                            </div>

                            <div>
                                <Label htmlFor="githubUrl">GitHub</Label>
                                <Input
                                    id="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    placeholder="https://github.com/username"
                                    disabled={isSaving}
                                    type="url"
                                />
                            </div>

                            <div>
                                <Label htmlFor="portfolioUrl">Portfolio</Label>
                                <Input
                                    id="portfolioUrl"
                                    value={formData.portfolioUrl}
                                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                    placeholder="https://yourportfolio.com"
                                    disabled={isSaving}
                                    type="url"
                                />
                            </div>

                            <div>
                                <Label htmlFor="twitterUrl">Twitter</Label>
                                <Input
                                    id="twitterUrl"
                                    value={formData.twitterUrl}
                                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                                    placeholder="https://twitter.com/username"
                                    disabled={isSaving}
                                    type="url"
                                />
                            </div>

                            <div>
                                <Label htmlFor="leetcodeUrl">LeetCode</Label>
                                <Input
                                    id="leetcodeUrl"
                                    value={formData.leetcodeUrl}
                                    onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                                    placeholder="https://leetcode.com/username"
                                    disabled={isSaving}
                                    type="url"
                                />
                            </div>

                            <div>
                                <Label htmlFor="instagramUrl">Instagram</Label>
                                <Input
                                    id="instagramUrl"
                                    value={formData.instagramUrl}
                                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                    placeholder="https://instagram.com/username"
                                    disabled={isSaving}
                                    type="url"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}