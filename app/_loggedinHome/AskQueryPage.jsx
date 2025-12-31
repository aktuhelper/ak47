"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadMultipleFilesToStrapi } from '@/app/utility/api';
import { postToStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper
import PageHeader from './_Askquerypage/PageHeader';
import QuestionTitleInput from './_Askquerypage/QuestionTitleInput';
import QuestionDetailsInput from './_Askquerypage/QuestionDetailsInput';
import CategorySelector from './_Askquerypage/CategorySelector';
import VisibilitySelector from './_Askquerypage/VisibilitySelector';
import FileUploadSection from './_Askquerypage/FileUploadSection';
import AnonymousToggle from './_Askquerypage/AnonymousToggle';
import ReviewModal from './_Askquerypage/ReviewModal';

const AskQueryPage = ({ userData }) => {
    const [title, setTitle] = useState('');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('academics');
    const [visibility, setVisibility] = useState('public');
    const [files, setFiles] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const maxWords = 100;
    const wordCount = query.trim() ? query.trim().split(/\s+/).length : 0;

    const handleSubmit = () => {
        if (title.trim() && query.trim() && wordCount <= maxWords) {
            setShowReviewModal(true);
        }
    };

    const createQuery = async (queryData, files) => {
        try {
       

            // Step 1: Upload files first if they exist
            let uploadedFileIds = [];

            if (files && Array.isArray(files) && files.length > 0) {
                
                const uploadedFiles = await uploadMultipleFilesToStrapi(files);
                uploadedFileIds = uploadedFiles.map(file => file.id);
                
            }

            // Step 2: Create the query with attached file IDs
            const payload = {
                title: queryData.title,
                description: queryData.query,
                category: queryData.category,
                visibility: queryData.visibility,
                isAnonymous: queryData.isAnonymous,
                user_profile: queryData.userDocumentId,
                viewCount: 0,
                answerCount: 0,
                quesstatus: 'active',
                ...(uploadedFileIds.length > 0 && { attachments: uploadedFileIds })
            };

          

            // ✅ Use secure API wrapper instead of direct axios call
            const response = await postToStrapi('queries', payload);

           
            return response;

        } catch (error) {
            console.error('❌ Error creating query:', error);
            console.error('Error details:', error.message);
            throw error;
        }
    };

    const confirmPost = async () => {
    

        // Check if user is logged in
        if (!userData || !userData.documentId) {
            toast.error('Please login to post a query');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const queryData = {
                title,
                query,
                category,
                visibility,
                isAnonymous,
                userId: userData.id,
                userDocumentId: userData.documentId
            };

         

            const response = await createQuery(queryData, files);

    
            toast.success('Query posted successfully!');

            // Reset form
            setShowReviewModal(false);
            setTitle('');
            setQuery('');
            setCategory('academics');
            setFiles([]);
            setIsAnonymous(false);
            setVisibility('public');

        } catch (error) {
            console.error('💥 Error posting query:', error);
            const errorMessage = error.message || 'Failed to post query. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <PageHeader />

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3">
                <QuestionTitleInput title={title} setTitle={setTitle} />

                <QuestionDetailsInput
                    query={query}
                    setQuery={setQuery}
                    maxWords={maxWords}
                />

                <CategorySelector category={category} setCategory={setCategory} />

                <VisibilitySelector visibility={visibility} setVisibility={setVisibility} />

                <FileUploadSection files={files} setFiles={setFiles} />

                <AnonymousToggle
                    isAnonymous={isAnonymous}
                    setIsAnonymous={setIsAnonymous}
                    onSubmit={handleSubmit}
                    title={title}
                    query={query}
                    wordCount={wordCount}
                    maxWords={maxWords}
                />
            </div>

            <ReviewModal
                show={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onConfirm={confirmPost}
                title={title}
                query={query}
                category={category}
                visibility={visibility}
                files={files}
                isAnonymous={isAnonymous}
                isSubmitting={isSubmitting}
                userData={userData}
            />
        </div>
    );
};

export default AskQueryPage;