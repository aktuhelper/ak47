import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";

export default function RejectionModal({
    isOpen,
    onClose,
    rejectionReason,
    onResubmit
}) {
    const handleResubmit = () => {
        onClose();
        if (onResubmit) {
            onResubmit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-700">
                        <X className="w-5 h-5" />
                        Verification Rejected
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-900 mb-2">Reason for Rejection:</p>
                        <p className="text-sm text-red-800">
                            {rejectionReason || "No specific reason provided. Please contact support for more details."}
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-900">
                            <strong>What to do next:</strong> Please review the rejection reason and submit a new verification request with the correct documents.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleResubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Resubmit Verification
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}