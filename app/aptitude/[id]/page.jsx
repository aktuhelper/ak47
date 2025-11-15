'use client';

import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, Award, Loader2, User } from 'lucide-react';

export default function TestAttemptPage() {
    const { user, isLoading: authLoading } = useKindeBrowserClient();

    const STRAPI_URL = typeof window !== 'undefined' && window.ENV?.NEXT_PUBLIC_STRAPI_URL
        ? window.ENV.NEXT_PUBLIC_STRAPI_URL
        : 'https://aktuhelperserver-production.up.railway.app';

    const getTestIdFromUrl = () => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/');
            return pathParts[pathParts.length - 1] || null;
        }
        return null;
    };

    const getTestData = () => {
        if (typeof window !== 'undefined') {
            const storedData = sessionStorage.getItem('currentTest');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const durationStr = parsed.duration?.toString() || '30';
                const durationNum = parseInt(durationStr.replace(/\D/g, '')) || 30;

                return {
                    id: parsed.id || getTestIdFromUrl(),
                    documentId: parsed.documentId,
                    title: parsed.title || 'Practice Set',
                    category: parsed.category || 'reasoning',
                    totalQuestions: parseInt(parsed.questions) || 5,
                    duration: durationNum,
                    totalMarks: parseInt(parsed.totalMarks) || 5
                };
            }
        }
        return {
            id: getTestIdFromUrl(),
            documentId: null,
            title: 'Practice Set',
            category: 'reasoning',
            totalQuestions: 5,
            duration: 30,
            totalMarks: 5
        };
    };

    const getCategoryName = (category) => {
        const categories = {
            'numerical': 'Numerical',
            'reasoning': 'Reasoning',
            'verbal': 'Verbal'
        };
        return categories[category?.toLowerCase()] || 'Reasoning';
    };

    const [testData, setTestData] = useState(getTestData());
    const [timeLeft, setTimeLeft] = useState(testData.duration * 60);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Wait for auth to load
        if (authLoading) {
            return;
        }

        // Check if user is authenticated
        if (!user || !user.email) {
            setError('Please log in to attempt the test');
            setLoading(false);
            return;
        }

        console.log('👤 User authenticated:', {
            id: user.id,
            email: user.email,
            name: `${user.given_name} ${user.family_name}`
        });

        // Get test data and fetch questions
        const data = getTestData();
        setTestData(data);
        setTimeLeft(data.duration * 60);

        if (data.id) {
            fetchQuestions(data.id);
        } else {
            setError('No test selected');
            setLoading(false);
        }
    }, [user, authLoading]);
    const fetchQuestions = async (testId) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch practice set details
            const practiceSetResponse = await fetch(`${STRAPI_URL}/api/practice-sets?filters[id][$eq]=${testId}`);

            if (!practiceSetResponse.ok) {
                throw new Error('Failed to fetch practice set');
            }

            const practiceSetData = await practiceSetResponse.json();
            console.log('📋 Practice set data:', practiceSetData);

            if (!practiceSetData.data || practiceSetData.data.length === 0) {
                throw new Error('Practice set not found');
            }

            const practiceSet = practiceSetData.data[0];
            const rawCategory = practiceSet.category;
            const practiceSetTitle = practiceSet.title;
            const questionCount = practiceSet.question || 30;

            console.log('🔍 Searching for questions:', {
                category: rawCategory,
                title: practiceSetTitle,
                count: questionCount
            });

            let questionsData = null;

            // Strategy 1: Try exact match with both category and title
            try {
                const url1 = `${STRAPI_URL}/api/apti-questions?filters[category][$eq]=${encodeURIComponent(rawCategory)}&filters[title][$eq]=${encodeURIComponent(practiceSetTitle)}&pagination[limit]=${questionCount}`;
                console.log('🔍 Strategy 1: Exact match (category + title)');
                const response1 = await fetch(url1);

                if (response1.ok) {
                    const data1 = await response1.json();
                    if (data1?.data && data1.data.length > 0) {
                        console.log(`✅ Strategy 1 success: Found ${data1.data.length} questions`);
                        questionsData = data1;
                    }
                }
            } catch (err) {
                console.log('⚠️ Strategy 1 failed:', err.message);
            }

            // Strategy 2: Try category only (case-sensitive)
            if (!questionsData?.data || questionsData.data.length === 0) {
                try {
                    const url2 = `${STRAPI_URL}/api/apti-questions?filters[category][$eq]=${encodeURIComponent(rawCategory)}&pagination[limit]=${questionCount}`;
                    console.log('🔍 Strategy 2: Category only (exact)');
                    const response2 = await fetch(url2);

                    if (response2.ok) {
                        const data2 = await response2.json();
                        if (data2?.data && data2.data.length > 0) {
                            console.log(`✅ Strategy 2 success: Found ${data2.data.length} questions`);
                            questionsData = data2;
                        }
                    }
                } catch (err) {
                    console.log('⚠️ Strategy 2 failed:', err.message);
                }
            }

            // Strategy 3: Try case-insensitive category variations
            if (!questionsData?.data || questionsData.data.length === 0) {
                const categoryVariations = [
                    rawCategory,
                    rawCategory.toLowerCase(),
                    rawCategory.toUpperCase(),
                    rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase(),
                    rawCategory.trim(),
                    rawCategory.toLowerCase().trim()
                ];

                console.log('🔍 Strategy 3: Case-insensitive variations');

                for (const variant of categoryVariations) {
                    try {
                        const url3 = `${STRAPI_URL}/api/apti-questions?filters[category][$eq]=${encodeURIComponent(variant)}&pagination[limit]=${questionCount}`;
                        const response3 = await fetch(url3);

                        if (response3.ok) {
                            const data3 = await response3.json();
                            if (data3?.data && data3.data.length > 0) {
                                console.log(`✅ Strategy 3 success with variant "${variant}": Found ${data3.data.length} questions`);
                                questionsData = data3;
                                break;
                            }
                        }
                    } catch (err) {
                        console.log(`⚠️ Strategy 3 failed for variant "${variant}":`, err.message);
                    }
                }
            }

            // Strategy 4: Fetch all questions and filter by category (last resort)
            if (!questionsData?.data || questionsData.data.length === 0) {
                try {
                    console.log('🔍 Strategy 4: Fetch all and filter');
                    const url4 = `${STRAPI_URL}/api/apti-questions?pagination[limit]=1000`;
                    const response4 = await fetch(url4);

                    if (response4.ok) {
                        const allData = await response4.json();

                        if (allData?.data && allData.data.length > 0) {
                            // Try to filter by category (case-insensitive)
                            const filtered = allData.data.filter(q =>
                                q.category?.toLowerCase() === rawCategory.toLowerCase()
                            );

                            if (filtered.length > 0) {
                                console.log(`✅ Strategy 4 success: Filtered ${filtered.length} questions`);
                                questionsData = { data: filtered.slice(0, questionCount) };
                            } else {
                                // If no match, just take any questions (for testing)
                                console.log(`⚠️ No category match, taking first ${questionCount} questions`);
                                questionsData = { data: allData.data.slice(0, questionCount) };
                            }
                        }
                    }
                } catch (err) {
                    console.log('⚠️ Strategy 4 failed:', err.message);
                }
            }

            // Final check
            if (!questionsData?.data || questionsData.data.length === 0) {
                throw new Error(`No questions found for category "${rawCategory}". Please ensure questions are added in Strapi.`);
            }

            // Transform questions
            const transformedQuestions = questionsData.data.map((item, index) => ({
                id: item.id || index + 1,
                question: item.questionText,
                options: Array.isArray(item.option) ? item.option : [],
                correct: item.correctAnswer,
                marks: item.marks || 1
            }));

            console.log(`✅ Successfully loaded ${transformedQuestions.length} questions`);
            console.log('📝 First question:', transformedQuestions[0]);

            setQuestions(transformedQuestions);
        } catch (err) {
            console.error('❌ Error fetching questions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft > 0 && !showResults && !loading) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResults && !loading) {
            handleSubmit();
        }
    }, [timeLeft, showResults, loading]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (questionId, optionIndex) => {
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const calculateScore = () => {
        let totalScore = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct) {
                totalScore += q.marks || 1;
            }
        });
        return totalScore;
    };

    const handleSubmit = async () => {
        if (!user || !user.email) {
            alert('User not authenticated. Please log in again.');
            return;
        }

        setSubmitting(true);
        const calculatedScore = calculateScore();
        setScore(calculatedScore);

        try {
            const correctAnswers = questions.filter(q => answers[q.id] === q.correct).length;
            const wrongAnswers = Object.keys(answers).length - correctAnswers;
            const unattemptedCount = questions.length - Object.keys(answers).length;

            console.log('💾 Saving test attempt:', {
                email: user.email,
                practiceSetId: testData.id,
                score: calculatedScore,
                totalMarks: testData.totalMarks
            });

            // Save test attempt to Strapi
            const response = await fetch(`${STRAPI_URL}/api/test-attempts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        email: user.email,
                        practice_set: testData.id,
                        score: calculatedScore,
                        totalMarks: testData.totalMarks,
                        correctAnswers: correctAnswers,
                        wrongAnswers: wrongAnswers,
                        unattempted: unattemptedCount,
                        completedAt: new Date().toISOString()
                    }
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Test attempt saved:', result);
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to save test attempt:', errorText);
            }
        } catch (err) {
            console.error('💥 Error saving test attempt:', err);
        } finally {
            setSubmitting(false);
            setShowResults(true);
        }
    };

    const handleReturnToHome = () => {
        window.location.href = '/aptitude';
    };

    const percentage = questions.length > 0 ? Math.round((score / testData.totalMarks) * 100) : 0;

    // Show loading while auth is loading
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-black dark:via-zinc-950 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-zinc-400">{authLoading ? 'Authenticating...' : 'Loading questions...'}</p>
                </div>
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-black dark:via-zinc-950 dark:to-black flex items-center justify-center p-4">
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 max-w-md w-full border border-red-200 dark:border-red-900 shadow-lg">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {error?.includes('log in') ? 'Authentication Required' : 'Failed to Load Questions'}
                        </h3>
                        <p className="text-gray-600 dark:text-zinc-400 mb-4">{error || 'No questions available'}</p>
                        <button
                            onClick={handleReturnToHome}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Return to Practice Sets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        const correctAnswers = questions.filter(q => answers[q.id] === q.correct).length;
        const wrongAnswers = Object.keys(answers).length - correctAnswers;
        const unattempted = questions.length - Object.keys(answers).length;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-black dark:via-zinc-950 dark:to-black flex items-center justify-center p-4">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    {/* User Info Header */}
                    {user && (
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
                            {user.picture ? (
                                <img
                                    src={user.picture}
                                    alt={`${user.given_name} ${user.family_name}`}
                                    className="w-12 h-12 rounded-full border-2 border-purple-200 dark:border-purple-800"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            )}
                            <div className="text-left">
                                <div className="font-semibold text-gray-900 dark:text-white">{user.given_name} {user.family_name}</div>
                                <div className="text-sm text-gray-500 dark:text-zinc-400">{user.email}</div>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <div className="mb-6">
                            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${percentage >= 70 ? 'bg-green-100 dark:bg-green-900/30' : percentage >= 50 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'
                                }`}>
                                <Award className={`w-12 h-12 ${percentage >= 70 ? 'text-green-600 dark:text-green-400' : percentage >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                                    }`} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Test Completed!</h2>
                        <p className="text-gray-600 dark:text-zinc-400 mb-6">Here's how you performed</p>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-purple-100 dark:border-purple-900">
                            <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">{score}/{testData.totalMarks}</div>
                            <div className="text-lg text-gray-700 dark:text-zinc-300 font-medium">{percentage}% Score</div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                                <span className="text-sm text-gray-700 dark:text-zinc-300 font-medium">Correct Answers</span>
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">{correctAnswers}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
                                <span className="text-sm text-gray-700 dark:text-zinc-300 font-medium">Wrong Answers</span>
                                <span className="text-lg font-bold text-red-600 dark:text-red-400">{wrongAnswers}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700">
                                <span className="text-sm text-gray-700 dark:text-zinc-300 font-medium">Unattempted</span>
                                <span className="text-lg font-bold text-gray-600 dark:text-zinc-400">{unattempted}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleReturnToHome}
                            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            Return to Practice Sets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-black dark:via-zinc-950 dark:to-black p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header with User Info */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4 mb-6 border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt={`${user.given_name} ${user.family_name}`}
                                    className="w-10 h-10 rounded-full border-2 border-purple-200 dark:border-purple-800"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            )}
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{getCategoryName(testData.category)} Ability</div>
                                <div className="text-sm text-gray-600 dark:text-zinc-400">{testData.title}</div>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                            <Clock className="w-5 h-5" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        {answers[questions[currentQuestion].id] !== undefined && (
                            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Answered
                            </span>
                        )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        {questions[currentQuestion].question}
                    </h2>

                    <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(questions[currentQuestion].id, index)}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${answers[questions[currentQuestion].id] === index
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
                                    : 'border-gray-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[questions[currentQuestion].id] === index
                                        ? 'border-purple-500 bg-purple-500'
                                        : 'border-gray-300 dark:border-zinc-600'
                                        }`}>
                                        {answers[questions[currentQuestion].id] === index && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <span className="font-medium dark:text-zinc-200">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-gray-200 dark:border-zinc-800"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <div className="flex gap-2 overflow-x-auto">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${currentQuestion === index
                                    ? 'bg-purple-600 text-white'
                                    : answers[questions[index].id] !== undefined
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Flag className="w-5 h-5" />
                                    Submit
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Question Overview */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Question Overview</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-600 dark:border-green-700"></div>
                                <span className="text-gray-600 dark:text-zinc-400">Answered ({Object.keys(answers).length})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"></div>
                                <span className="text-gray-600 dark:text-zinc-400">Unanswered ({questions.length - Object.keys(answers).length})</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`h-10 rounded-lg font-medium transition-all text-sm ${currentQuestion === index
                                    ? 'bg-purple-600 text-white ring-2 ring-purple-300 dark:ring-purple-700'
                                    : answers[questions[index].id] !== undefined
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-600 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                Q{index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}