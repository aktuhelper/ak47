import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload } from "lucide-react";
import toast from 'react-hot-toast';
import { submitVerificationRequest } from "@/app/utility/api";

export default function VerificationModal({
    isOpen,
    onClose,
    userData,
    onVerificationSubmitted
}) {
    const [verificationFile, setVerificationFile] = useState(null);
    const [verificationPreview, setVerificationPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type (images and PDFs)
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid file (JPG, PNG, or PDF)');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB');
            return;
        }

        setVerificationFile(file);

        // Show preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVerificationPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setVerificationPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!verificationFile) {
            toast.error('Please upload a supporting document');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading('Submitting verification request...');

        try {
            const result = await submitVerificationRequest(
                userData.documentId,
                verificationFile
            );

            console.log('Verification submitted successfully:', result);

            toast.success('Verification request submitted successfully! You will be notified once it is approved.', {
                id: loadingToast,
                duration: 5000,
            });

            // Notify parent component
            if (onVerificationSubmitted) {
                onVerificationSubmitted();
            }

            // Close modal and reset state
            handleClose();

        } catch (error) {
            console.error('Error submitting verification:', error);
            toast.error(`Failed to submit verification: ${error.message || 'Unknown error occurred'}`, {
                id: loadingToast,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setVerificationFile(null);
        setVerificationPreview(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Get Verified
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        To get verified, please upload a supporting document such as:
                    </p>

                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                        <li>Student ID Card</li>
                        <li>College ID Card</li>
                        <li>Enrollment Letter</li>
                        <li>Fee Receipt</li>
                    </ul>

                    <div className="space-y-3">
                        <Label htmlFor="verification-doc">Upload Document *</Label>

                        {verificationPreview && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                                <img
                                    src={verificationPreview}
                                    alt="Verification document preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {verificationFile && !verificationPreview && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                <Upload className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm font-medium truncate">{verificationFile.name}</span>
                            </div>
                        )}

                        <label
                            htmlFor="verification-doc"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {verificationFile ? 'Change Document' : 'Choose Document'}
                            </span>
                        </label>
                        <input
                            id="verification-doc"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isSubmitting}
                        />

                        <p className="text-xs text-muted-foreground">
                            Accepted formats: JPG, PNG, PDF (Max 2MB)
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-900">
                            <strong>Note:</strong> Your document will be reviewed by our team. You'll receive a notification once your verification is approved (usually within 24-48 hours).
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !verificationFile}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Submit for Verification
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}