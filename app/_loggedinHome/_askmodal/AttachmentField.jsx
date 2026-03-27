import React, { useRef } from 'react';
import { Upload, Paperclip, AlertCircle, X } from 'lucide-react';

export default function AttachmentField({ T, attachment, attachmentPreview, setAttachment, setAttachmentPreview, errors, setErrors }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowed = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowed.includes(file.type)) {
            setErrors({ ...errors, attachment: 'Only JPG, PNG, PDF, DOCX' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setErrors({ ...errors, attachment: 'Max 2MB allowed' });
            return;
        }

        setAttachment(file);
        setErrors({ ...errors, attachment: null });

        if (file.type.startsWith('image/')) {
            const r = new FileReader();
            r.onloadend = () => setAttachmentPreview(r.result);
            r.readAsDataURL(file);
        } else {
            setAttachmentPreview(null);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        setAttachmentPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="aqm-field">

            {/* Label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                <Paperclip size={12} style={{ color: T.mutedColor }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: T.labelColor }}>
                    Attachment
                </span>
                <span style={{ fontSize: 12, color: T.mutedColor, fontWeight: 400 }}>
                    optional
                </span>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf,.docx"
                onChange={handleFileChange}
                id="aqm-file"
                style={{ display: 'none' }}
            />

            {/* Upload zone or file preview */}
            {!attachment ? (
                <label
                    htmlFor="aqm-file"
                    className="aqm-upload-zone"
                    style={{ borderColor: T.uploadBorder, background: T.uploadBg, display: 'flex' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = T.uploadHoverBorder;
                        e.currentTarget.style.background = T.uploadHoverBg;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = T.uploadBorder;
                        e.currentTarget.style.background = T.uploadBg;
                    }}
                >
                    <div style={{
                        width: 42, height: 42, borderRadius: 11,
                        background: T.uploadIconBg,
                        border: `1px solid ${T.uploadIconBorder}`,
                        color: T.uploadIconColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Upload size={17} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.uploadText }}>
                        Click to upload a file
                    </div>
                    <div style={{ fontSize: 11.5, color: T.uploadSub }}>
                        JPG, PNG, PDF, DOCX · Max 2MB
                    </div>
                </label>
            ) : (
                <div
                    className="aqm-file-preview"
                    style={{ background: T.filePreviewBg, borderColor: T.filePreviewBorder }}
                >
                    {attachmentPreview ? (
                        <img
                            src={attachmentPreview}
                            alt=""
                            style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                        />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px' }}>
                            <div style={{ fontSize: 26 }}>
                                {attachment.type === 'application/pdf' ? '📄' : '📝'}
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: T.textColor }}>
                                    {attachment.name}
                                </div>
                                <div style={{ fontSize: 11.5, color: T.mutedColor, marginTop: 2 }}>
                                    {(attachment.size / 1024).toFixed(1)} KB
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Remove button */}
                    <button
                        type="button"
                        className="aqm-file-remove"
                        style={{ background: T.fileRemoveBg, borderColor: T.fileRemoveBorder }}
                        onClick={removeAttachment}
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            {/* Error */}
            {errors.attachment && (
                <div className="aqm-error-msg">
                    <AlertCircle size={12} />
                    {errors.attachment}
                </div>
            )}

        </div>
    );
}