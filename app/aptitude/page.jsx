'use client';

import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Brain, Calculator, Target, Clock, BookOpen, ChevronRight, Award, TrendingUp, RotateCcw, Loader2, AlertCircle, User, Trophy, X } from 'lucide-react';

export default function AptitudePage() {
  const { user, isLoading: authLoading } = useKindeBrowserClient();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [practiceSets, setPracticeSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionCounts, setQuestionCounts] = useState({});
  const [userAttempts, setUserAttempts] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const STRAPI_URL = typeof window !== 'undefined' && window.ENV?.NEXT_PUBLIC_STRAPI_URL
    ? window.ENV.NEXT_PUBLIC_STRAPI_URL
    : 'https://aktuhelperserver-production.up.railway.app';

  useEffect(() => {
    fetchPracticeSets();
  }, []);

  useEffect(() => {
    if (user?.email && !authLoading) {
      fetchUserAttempts(user.email);
    }
  }, [user, authLoading]);

  const fetchQuestionCount = async (category) => {
    try {
      const variations = [
        category,
        category.toLowerCase(),
        category.toUpperCase(),
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
        category.trim(),
        category.toLowerCase().trim(),
        ' ' + category.toLowerCase(),
      ];

      for (const variant of variations) {
        const url = `${STRAPI_URL}/api/apti-questions?filters[category][$eq]=${variant}&pagination[limit]=1`;
        const response = await fetch(url);
        const data = await response.json();
        const count = data.meta?.pagination?.total || 0;

        if (count > 0) {
          return count;
        }
      }

      return 0;
    } catch (err) {
      console.error(`Error fetching question count for ${category}:`, err);
      return 0;
    }
  };

  const fetchUserAttempts = async (email) => {
    try {
      setHistoryLoading(true);
      console.log('📊 Fetching attempts for user:', email);

      const response = await fetch(
        `${STRAPI_URL}/api/test-attempts?filters[email][$eq]=${encodeURIComponent(email)}&populate=practice_set&sort=completedAt:desc`
      );

      if (!response.ok) {
        console.error('Failed to fetch user attempts');
        return;
      }

      const data = await response.json();
      console.log('📊 User attempts data:', data);

      if (!data.data || data.data.length === 0) {
        console.log('No attempts found for user');
        setUserAttempts({});
        setUserHistory([]);
        return;
      }

      const attemptsMap = {};
      const historyList = [];

      data.data.forEach((attempt) => {
        const practiceSetId = attempt.practice_set?.id;

        if (practiceSetId) {
          if (!attemptsMap[practiceSetId] || attempt.score > attemptsMap[practiceSetId].score) {
            attemptsMap[practiceSetId] = {
              score: attempt.score,
              totalMarks: attempt.totalMarks,
              correctAnswers: attempt.correctAnswers,
              wrongAnswers: attempt.wrongAnswers,
              unattempted: attempt.unattempted,
              completedAt: attempt.completedAt
            };
          }
        }

        historyList.push({
          id: attempt.id,
          practiceSetId: practiceSetId,
          practiceSetTitle: attempt.practice_set?.title || 'Unknown Set',
          category: attempt.practice_set?.category || 'Unknown',
          score: attempt.score,
          totalMarks: attempt.totalMarks,
          correctAnswers: attempt.correctAnswers,
          wrongAnswers: attempt.wrongAnswers,
          unattempted: attempt.unattempted,
          completedAt: attempt.completedAt
        });
      });

      setUserAttempts(attemptsMap);
      setUserHistory(historyList);

      console.log('✅ User attempts loaded:', attemptsMap);
      console.log('✅ User history loaded:', historyList.length, 'attempts');
    } catch (err) {
      console.error('Error fetching user attempts:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchPracticeSets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${STRAPI_URL}/api/practice-sets`);

      if (!response.ok) {
        throw new Error('Failed to fetch practice sets');
      }

      const data = await response.json();

      const transformedSets = data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        category: item.category,
        questions: item.question,
        duration: item.duraton,
        difficulty: item.difficulty || 'medium',
        totalMarks: item.total_marks,
        attempted: item.attempted || 0
      }));

      console.log('📋 Transformed practice sets:', transformedSets);
      setPracticeSets(transformedSets);

      const categories = ['numerical', 'reasoning', 'verbal'];
      const counts = {};

      for (const cat of categories) {
        counts[cat] = await fetchQuestionCount(cat);
      }

      setQuestionCounts(counts);

    } catch (err) {
      console.error('Error fetching practice sets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen, color: 'bg-gradient-to-br from-indigo-500 to-purple-500' },
    { id: 'numerical', name: 'Numerical Ability', icon: Calculator, color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { id: 'reasoning', name: 'Reasoning Ability', icon: Brain, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'verbal', name: 'Verbal Ability', icon: BookOpen, color: 'bg-gradient-to-br from-green-500 to-emerald-500' },
  ];

  const filteredSets = selectedCategory === 'all'
    ? practiceSets
    : practiceSets.filter(set => set.category === selectedCategory);

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  const getScoreColor = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const isSetAvailable = (set) => {
    const count = questionCounts[set.category] || 0;
    return count > 0;
  };

  const hasUserAttempted = (setId) => {
    return userAttempts[setId] !== undefined;
  };

  const getUserScore = (setId) => {
    return userAttempts[setId] || null;
  };

  const handleStartPractice = (set) => {
    if (!user) {
      // Store current URL as return URL before redirecting to login
      sessionStorage.setItem('returnUrl', window.location.pathname);
      // Redirect to login page
      window.location.href = '/api/auth/login';
      return;
    }

    if (!isSetAvailable(set)) {
      alert(`No questions available for ${set.category} category yet. Please try another practice set.`);
      return;
    }

    sessionStorage.setItem('currentTest', JSON.stringify({
      id: set.id,
      documentId: set.documentId,
      title: set.title,
      category: set.category,
      questions: set.questions,
      duration: parseInt(set.duration),
      totalMarks: set.totalMarks
    }));

    window.location.href = `/aptitude/${set.id}`;
  };

  const handleReattempt = (set) => {
    handleStartPractice(set);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getPercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{authLoading ? 'Authenticating...' : 'Loading practice sets...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full border border-red-200 shadow-lg">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchPracticeSets}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {user && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={`${user.given_name} ${user.family_name}`}
                    className="w-12 h-12 rounded-full border-2 border-purple-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">{user.given_name} {user.family_name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full sm:w-auto px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span className="whitespace-nowrap">{showHistory ? 'Hide' : 'View'} History</span>
              </button>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-start justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Your Test History</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Track your progress and performance</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                {historyLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">Loading your history...</p>
                  </div>
                ) : userHistory.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {userHistory.map((attempt, index) => {
                      const percentage = getPercentage(attempt.score, attempt.totalMarks);
                      const categoryInfo = getCategoryInfo(attempt.category);

                      return (
                        <div
                          key={attempt.id}
                          className={`p-3 sm:p-5 rounded-xl border-2 transition-all hover:shadow-md ${getScoreBgColor(attempt.score, attempt.totalMarks)}`}
                        >
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`px-2 py-1 rounded text-xs font-medium text-white ${categoryInfo.color}`}>
                                  {attempt.category}
                                </span>
                                {index === 0 && (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                    Latest
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2">{attempt.practiceSetTitle}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">{formatDate(attempt.completedAt)}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(attempt.score, attempt.totalMarks)}`}>
                                {attempt.score}
                                <span className="text-base sm:text-lg text-gray-400">/{attempt.totalMarks}</span>
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
                                {percentage}%
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${percentage >= 80 ? 'bg-green-500' :
                                    percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
                            <div className="flex items-center gap-1.5 text-green-600">
                              <div className="w-2 h-2 rounded-full bg-green-600"></div>
                              <span className="font-medium">{attempt.correctAnswers} Correct</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-red-600">
                              <div className="w-2 h-2 rounded-full bg-red-600"></div>
                              <span className="font-medium">{attempt.wrongAnswers} Wrong</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                              <span className="font-medium">{attempt.unattempted} Skipped</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No attempts yet</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Start practicing to track your progress!</p>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Start Practicing
                    </button>
                  </div>
                )}
              </div>

              {userHistory.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{userHistory.length}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{Object.keys(userAttempts).length}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Sets Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {Math.round(
                          userHistory.reduce((sum, h) => sum + getPercentage(h.score, h.totalMarks), 0) /
                          userHistory.length
                        )}%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Avg Score</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Aptitude Practice</h1>
          </div>
          <p className="text-gray-600">Master aptitude with comprehensive practice sets</p>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl transition-all duration-300 ${selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg scale-105`
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                    }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${selectedCategory === category.id ? 'text-white' : 'text-gray-600'}`} />
                  <div className="text-sm font-medium text-center">
                    {category.name}
                  </div>
                  {category.id !== 'all' && questionCounts[category.id] !== undefined && (
                    <div className={`text-xs mt-1 ${selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {questionCounts[category.id]} questions
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredSets.length}</div>
                <div className="text-sm text-gray-600">Practice Sets</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {user ? Object.keys(userAttempts).length : 0}
                </div>
                <div className="text-sm text-gray-600">You Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {user ? userHistory.length : 0}
                </div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSets.map((set) => {
            const categoryInfo = getCategoryInfo(set.category);
            const CategoryIcon = categoryInfo.icon;
            const available = isSetAvailable(set);
            const userScore = getUserScore(set.id);
            const attempted = hasUserAttempted(set.id);

            return (
              <div
                key={set.id}
                className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 ${!available ? 'opacity-75' : ''}`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white ${categoryInfo.color} flex items-center gap-1.5`}>
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {categoryInfo.name}
                    </span>
                    {!available && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 mb-4">
                    {set.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{set.questions} Qs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{set.duration}</span>
                    </div>
                  </div>

                  {attempted && userScore ? (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">Your Best Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(userScore.score, userScore.totalMarks)}`}>
                          {userScore.score}/{userScore.totalMarks}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(userScore.score / userScore.totalMarks) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(userScore.completedAt)}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">Total Marks</span>
                        <span className="text-lg font-bold text-gray-900">
                          {set.totalMarks}
                        </span>
                      </div>
                    </div>
                  )}

                  {attempted ? (
                    <button
                      onClick={() => handleReattempt(set)}
                      disabled={!available}
                      className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
                        available
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      {available ? 'Reattempt' : 'Not Available'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartPractice(set)}
                      disabled={!available}
                      className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
                        available
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {!user ? 'Login to Start' : available ? 'Start Practice' : 'Not Available'}
                        {available && <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSets.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practice sets found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}