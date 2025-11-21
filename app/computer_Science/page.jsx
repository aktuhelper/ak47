"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Search, Calendar, Star, TrendingUp, CheckCircle, Clock, FileQuestion, Lightbulb, BookMarked, GraduationCap, Code, X, ChevronRight, Loader2 } from 'lucide-react';
import { getStudyMaterials } from '../_utils/GlobalApi';
import { BOOK_LINKS } from '../_utils/bookLinks';
export default function StudyMaterialsPage() {
    const [customerEmail, setCustomerEmail] = useState('');
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const [showBookNotFoundModal, setShowBookNotFoundModal] = useState(false);
    const [notFoundSubject, setNotFoundSubject] = useState({ name: '', code: '' });
    const [customerName, setCustomerName] = useState('');
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [apiMaterials, setApiMaterials] = useState({});
    const [loading, setLoading] = useState(true);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [selectedDownloadSubject, setSelectedDownloadSubject] = useState(null);
    // Hardcoded subject names and codes for SEO
    const hardcodedSubjects = {
        1: [
            { subject: 'Engineering Chemistry', code: 'BAS102', icon: Code },
            { subject: 'Engineering Mathematics-I', code: 'BAS103', icon: BookOpen },
            { subject: 'Fundamentals of Electrical Engineering', code: 'BEE101', icon: Lightbulb },
            { subject: 'Fundamentals of Electronics Engineering', code: 'BEC101', icon: FileText },
          
        ],
        2: [
            { subject: 'Programming for Problem Solving', code: 'BCS101', icon: BookMarked },
            { subject: 'Fundamentals of Mechanical Engineering', code: 'BME101 ', icon: BookMarked },
            { subject: 'Environment and Ecology', code: 'BAS104', icon: BookMarked },
            { subject: 'Soft Skills', code: 'BAS105', icon: BookMarked },
        ],
        3: [
            { subject: 'Math IV', code: 'BAS303', icon: Code },
            { subject: 'UHV(Universal Human Value and Professional Ethics)', code: 'BVE301', icon: BookOpen },
            { subject: 'Technical Communication ', code: 'BAS301', icon: FileText },
            { subject: 'Data Structure ', code: 'BCS301 ', icon: BookMarked },
           
        ],
        4: [
            { subject: 'COA(Computer Organization and Architecture)', code: 'BCS302', icon: Code },
            { subject: 'DSTL', code: 'BCS303', icon: BookOpen },
            { subject: 'Python Programming ', code: 'BCC302', icon: FileText },
            { subject: 'Cyber Security', code: 'BCC301', icon: BookMarked },
            { subject: 'TAFL(Theory of Automata and Formal Languages)', code: 'BCS402', icon: Lightbulb },
        ],
        5: [
            { subject: ' DBMS (Database Management System) ', code: 'BCS501', icon: Code },
            { subject: 'Web Technology', code: 'BCS502', icon: BookOpen },
            { subject: 'Design and Analysis of Algorithm', code: 'BCS503', icon: FileText },
            { subject: 'Constitution of India', code: 'BNC501', icon: BookMarked },
            
        ],
        6: [
            { subject: 'Software Engineering', code: 'BCS601', icon: Code },
            { subject: 'Compiler Design', code: 'BCS602', icon: BookOpen },
            { subject: 'Computer Networks', code: 'BCS603', icon: FileText },
            { subject: 'Essence of Indian Traditional Knowledge ', code: 'BNC602', icon: BookMarked },
             
        ],
        7: [
            { subject: 'Artificial Intelligence', code: 'BCS701', icon: Code },
            { subject: 'Cloud Computing', code: 'BCS07', icon: BookOpen },
         

        ],
        8: [
            { subject: 'Cryptography and Network Security', code: 'BCS072', icon: FileText },
        ]
  };
    useEffect(() => {
        document.title = "B.Tech CSE Study Materials | AKTU Notes, PYQ, Quantum Books - AKTU Helper";

        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
        metaDesc.name = "description";
        metaDesc.content = "Download free AKTU B.Tech Computer Science study materials - Syllabus, Previous Year Question Papers, Quantum Books of First Year, Second Year ,Third Year,Fourth Year & Handwritten Notes for Semester 1-8. BCS301, BCS501, BCS601 and more.";
        document.head.appendChild(metaDesc);

        // Keywords
        const metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        metaKeywords.content = "AKTU study materials, B.Tech CSE notes,First Year quantum,Second Year quantum,Third Year Quantum,Fourth Year Quantum, AKTU PYQ, Quantum books PDF, BCS301, BCS501, BCS601, AKTU syllabus 2024-25, computer science engineering notes";
        document.head.appendChild(metaKeywords);
    }, []);
    useEffect(() => {
          async function fetchAllSemesters() {
              setLoading(true);
              try {
                  const materialsData = {};
  
                  for (let sem = 1; sem <= 8; sem++) {
                      const data = await getStudyMaterials({
                          courseName: "btech",
                          branchName: "cse",
                          semester: sem,
                      });
                      console.log("Fetching data for semester:", sem);
  
                      if (data && data.length > 0) {
                          materialsData[sem] = data.map(subject => ({
                              id: subject.id,
                              subject_name: subject.subject_name,
                              subject_code: subject.subject_code,
                              materials: organizeMaterials(subject.materials)
                          }));
                      }
                  }
  
                  setApiMaterials(materialsData);
              } catch (err) {
                  console.error('Error fetching materials:', err);
              } finally {
                  setLoading(false);
              }
          }
  
          fetchAllSemesters();
    }, []);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    const handleFreeDownload = async () => {
        try {
            // Validate email
            if (!customerEmail || !customerName) {
                alert('Please enter your name and email address');
                return;
            }

            // Validate selectedDownloadSubject exists
            if (!selectedDownloadSubject || !selectedDownloadSubject.code) {
                alert('Please select a subject first');
                return;
            }

            setIsLoadingDownload(true);

            console.log('Sending free download request with:', {
                email: customerEmail,
                name: customerName,
                subjectCode: selectedDownloadSubject.code,
                subjectName: selectedDownloadSubject.name,
            });

            // Send book link via email
            const response = await fetch('/api/send-book-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: customerEmail,
                    name: customerName,
                    subjectCode: selectedDownloadSubject.code,
                    subjectName: selectedDownloadSubject.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send email');
            }

            alert(`✅ Download link sent to ${customerEmail}! Please check your inbox.`);
            setShowDownloadModal(false);
            setShowDonateModal(false); // Also close donate modal if it's open

            // Reset form
            setCustomerEmail('');
            setCustomerName('');
            setSelectedDownloadSubject(null);

        } catch (error) {
            console.error('Failed to send download link:', error);
            alert(`❌ Failed to send email: ${error.message}`);
        } finally {
            setIsLoadingDownload(false);
        }
    };


  const organizeMaterials = (materials) => {
    const organized = {
      syllabus: { available: false, items: [] },
      pyq: { available: false, hasYears: false, items: [] },
      books: { available: true, items: [] },
      notes: { available: false, items: [] }
    };

    console.log('organizeMaterials received:', materials);

    materials?.forEach(material => {
      console.log('Processing material:', material);

      // Try both 'type' and 'material_type' fields
      let type = (material.type || material.material_type || '').toLowerCase().trim();

      console.log('Extracted type:', type);

      // Map 'book' to 'books' to match our organized structure
      if (type === 'book') {
        type = 'books';
      }

      if (organized[type]) {
        organized[type].available = true;
        organized[type].items.push({
          id: material.id,
          year: material.year,
          link: material.link,
          file: material.file
        });

        if (material.year && type === 'pyq') {
          organized[type].hasYears = true;
        }
      } else {
        console.log('Type not found in organized:', type);
      }
    });

    console.log('Organized result:', organized);
    return organized;
  };
    const handleQuantumBookClick = (subjectName, subjectCode) => {
        const bookData = BOOK_LINKS[subjectCode];

        if (!bookData || !bookData.link) {
            // Book not available - show "Not Found" modal
            setNotFoundSubject({
                name: subjectName,
                code: subjectCode
            });
            setShowBookNotFoundModal(true);
        } else {
            // Book available - show DONATION modal instead of free download
            setSelectedDownloadSubject({
                name: subjectName,
                code: subjectCode
            });
            setShowDonateModal(true); // Changed from setShowDownloadModal
        }
    };
    const handleDonateAndDownload = async () => {
        try {
            if (!customerEmail || !customerName) {
                alert('Please enter your name and email address');
                return;
            }

            if (donationAmount < 20) {
                alert('Minimum donation amount is ₹20');
                return;
            }

            setIsProcessingPayment(true);

            // Create Razorpay order with customer details
            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: donationAmount,
                    subjectCode: selectedDownloadSubject.code,
                    subjectName: selectedDownloadSubject.name,
                    customerName: customerName,      // ADDED
                    customerEmail: customerEmail,    // ADDED
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderData.id) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: 'INR',
                name: 'AKTUHELPER',
                description: `${selectedDownloadSubject.name} - Quantum Book`,
                order_id: orderData.id,
                prefill: {
                    name: customerName,
                    email: customerEmail,
                },
                theme: {
                    color: '#3B82F6',
                },
                handler: function (response) {
                    // Payment successful
                    handlePaymentSuccess(response);
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessingPayment(false);
                        console.log('Payment cancelled by user');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment failed:', error);
            alert(error.message || 'Payment failed. Please try again.');
            setIsProcessingPayment(false);
        }
    };
    const handlePaymentSuccess = async (paymentResponse) => {
        try {
            // Show success message
            alert(`🎉 Payment successful! 
        
Thank you for your donation of ₹${donationAmount}!

You will receive the download link at ${customerEmail} within a few moments.

Payment ID: ${paymentResponse.razorpay_payment_id}`);

            // Close modal and reset form
            setShowDonateModal(false);
            setCustomerEmail('');
            setCustomerName('');
            setDonationAmount(20);
            setIsProcessingPayment(false);

        } catch (error) {
            console.error('Post-payment processing error:', error);
            alert('Payment successful but there was an issue. Please check your email or contact support.');
            setIsProcessingPayment(false);
        }
    };

    const getMergedMaterials = () => {
    // Hardcoded syllabus links for CSE branch
    const syllabusLinks = {
      1: "https://aktu.ac.in/pdf/syllabus/syllabus2223/Syllabus_BTech_First_Yr_Common_other_than_AG_&_BT_effective_from_2022_23_R.pdf",
      2: "https://aktu.ac.in/pdf/syllabus/syllabus2223/Syllabus_BTech_First_Yr_Common_other_than_AG_&_BT_effective_from_2022_23_R.pdf",
      3: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2324/B.Tech_2nd_Yr_CSE_v3.pdf",
      4: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2324/B.Tech_2nd_Yr_CSE_v3.pdf",
      5: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2425/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%203rd%20Year%202024-25.pdf",
      6: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2425/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%203rd%20Year%202024-25.pdf",
      7: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2526/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%204th%20Year%202025-26.pdf",
      8: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2526/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%204th%20Year%202025-26.pdf",
    };
    const hardcoded = hardcodedSubjects[selectedSemester] || [];
    const apiData = apiMaterials[selectedSemester] || [];

    return hardcoded.map(hardSubject => {
      const apiSubject = apiData.find(api =>
        api.subject_code === hardSubject.code ||
        api.subject_name.toLowerCase() === hardSubject.subject.toLowerCase()
      );

      const materials = apiSubject?.materials || {
        syllabus: { available: false, items: [] },
        pyq: { available: false, hasYears: false, items: [] },
        books: { available: true, items: [] },
        notes: { available: false, items: [] }
      };

      // ✅ Inject hardcoded syllabus link if missing
      if (!materials.syllabus.available && syllabusLinks[selectedSemester]) {
        materials.syllabus.available = true;
        materials.syllabus.items.push({
          id: `syllabus-${selectedSemester}`,
          link: syllabusLinks[selectedSemester],
        });
      }

      return {
        id: hardSubject.code,
        subject: hardSubject.subject,
        code: hardSubject.code,
        icon: hardSubject.icon,
        materials,
      };
    });
  };

  const semesters = [
    { id: 1, name: 'Semester 1', subjects: hardcodedSubjects[1]?.length || 0 },
    { id: 2, name: 'Semester 2', subjects: hardcodedSubjects[2]?.length || 0 },
    { id: 3, name: 'Semester 3', subjects: hardcodedSubjects[3]?.length || 0 },
    { id: 4, name: 'Semester 4', subjects: hardcodedSubjects[4]?.length || 0 },
    { id: 5, name: 'Semester 5', subjects: hardcodedSubjects[5]?.length || 0 },
    { id: 6, name: 'Semester 6', subjects: hardcodedSubjects[6]?.length || 0 },
    { id: 7, name: 'Semester 7', subjects: hardcodedSubjects[7]?.length || 0 },
    { id: 8, name: 'Semester 8', subjects: hardcodedSubjects[8]?.length || 0 }
  ];
   const categories = ['All', 'Syllabus', 'PYQ', 'Notes'];
  
      const currentMaterials = getMergedMaterials();
  
      const filteredMaterials = currentMaterials.filter(material => {
          const matchesSearch = material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
              material.code.toLowerCase().includes(searchQuery.toLowerCase());
  
          if (selectedCategory === 'All') return matchesSearch;
  
          // Map display names to internal keys
          const categoryMap = {
              'Syllabus': 'syllabus',
              'PYQ': 'pyq',
              'Books': 'books',
              'Notes': 'notes'
          };
  
          const categoryKey = categoryMap[selectedCategory];
          return matchesSearch && material.materials[categoryKey]?.available;
      });
  
      // Updated material icon mapping and display names
      const getMaterialIcon = (type) => {
          const icons = {
              syllabus: FileText,
              pyq: FileQuestion,
              books: BookMarked,
              notes: BookOpen
          };
          return icons[type] || FileText;
      };
  
      const getMaterialDisplayName = (type) => {
          const names = {
              syllabus: 'Syllabus',
              pyq: 'PYQ',
              books: 'Books',
              notes: 'Notes'
          };
          return names[type] || type;
      };
  const handleMaterialClick = (materialCode, materialType, materialData, subjectName) => {
    // NEW: If it's a Quantum Book (books), show payment modal instead
    if (materialType === 'books') {
      handleQuantumBookClick(subjectName, materialCode);
      return;
    }

    // Existing logic for other materials (PYQ with years)
    if (materialData.hasYears && materialData.items.length > 0) {
      const yearGroups = {};
      materialData.items.forEach(item => {
        const key = item.year || 'Unknown';
        if (!yearGroups[key]) {
          yearGroups[key] = [];
        }
        yearGroups[key].push(item);
      });

      const years = Object.entries(yearGroups).map(([year, items]) => ({
        year: year,
        items: items,
        type: items.length > 1 ? 'Multiple' : 'Paper',
        size: '2.5 MB',
        downloads: Math.floor(Math.random() * 500) + 200
      })).sort((a, b) => b.year.localeCompare(a.year));

      setSelectedMaterial({
        code: materialCode,
        type: materialType,
        subject: subjectName,
        data: { years }
      });
      setShowMaterialModal(true);
    } else if (materialData.available && materialData.items.length > 0) {
      // Direct download for non-year based materials (Syllabus, Notes)
      window.open(materialData.items[0].link, '_blank');
    }
  };
  const handleDownload = (link) => {
          if (link) {
              window.open(link, '_blank');
          }
      };
  
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-black dark:via-zinc-950 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-zinc-400">Loading study materials...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-black dark:via-zinc-950 dark:to-black">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse dark:bg-blue-500/10" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse dark:bg-purple-500/10" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <div className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4 sm:mb-6 dark:bg-blue-900/30 dark:border-blue-800">
                            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-400">Computer Science & Engineering</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight px-4">
                            Study Materials Portal For Computer Science Engineering
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
                            Access semester-wise syllabus, notes, PYQs, and Quantum books of First Year, Second  Year, Third Year ,Fourth Year all in one place
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search subjects or codes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 outline-none transition-all duration-300 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative px-4 sm:px-6 pb-12 sm:pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Sidebar - Semester Selection */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 sticky top-6 shadow-lg dark:bg-zinc-900 dark:border-zinc-800">
                                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 dark:text-white">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                    Semesters
                                </h2>
                                <div className="space-y-2">
                                    {semesters.map((sem) => (
                                        <button
                                            key={sem.id}
                                            onClick={() => setSelectedSemester(sem.id)}
                                            className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${selectedSemester === sem.id
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm sm:text-base">{sem.name}</span>
                                                <span className={`text-xs sm:text-sm px-2 py-0.5 rounded-full ${selectedSemester === sem.id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-400'
                                                    }`}>
                                                    {sem.subjects} subjects
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content - Subject Cards */}
                        <div className="lg:col-span-3">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Semester {selectedSemester} - Study Materials
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                                    {filteredMaterials.length} subject{filteredMaterials.length !== 1 ? 's' : ''} found
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredMaterials.map((material, index) => {
                                    const Icon = material.icon;
                                    const materialOrder = ['syllabus', 'pyq', 'books', 'notes'];

                                    return (
                                        <div
                                            key={material.id}
                                            className="relative group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            <div className="relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800">
                                                {/* Subject Header */}
                                                <div className="bg-slate-50 border-b-2 border-slate-100 p-4 dark:bg-zinc-800 dark:border-zinc-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <h3 className="text-base font-bold text-slate-900 truncate dark:text-white">{material.subject}</h3>
                                                            <p className="text-xs text-slate-600 dark:text-zinc-400">{material.code}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md flex-shrink-0 dark:bg-amber-900/30 dark:border-amber-800">
                                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                                                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Popular</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Materials Grid */}
                                                <div className="p-4 dark:bg-zinc-900">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {materialOrder.map((type) => {
                                                            const data = material.materials[type];
                                                            const MaterialIcon = getMaterialIcon(type);
                                                            const displayName = getMaterialDisplayName(type);

                                                            return (
                                                                <button
                                                                    key={type}
                                                                    disabled={!data.available}
                                                                    onClick={() => handleMaterialClick(material.code, type, data, material.subject)}
                                                                    className={`relative p-3 rounded-lg border-2 transition-all duration-300 text-left ${data.available
                                                                        ? 'border-slate-200 hover:border-blue-400 hover:shadow-md bg-white cursor-pointer transform hover:scale-105 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-blue-500'
                                                                        : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-50 dark:bg-zinc-900 dark:border-zinc-800'
                                                                        }`}
                                                                >
                                                                    <div className="flex flex-col items-center text-center gap-2">
                                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data.available
                                                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                                            : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600'
                                                                            }`}>
                                                                            <MaterialIcon className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="w-full">
                                                                            <h4 className="text-xs font-semibold text-slate-900 mb-1 truncate dark:text-white">
                                                                                {displayName}
                                                                            </h4>
                                                                            {data.available ? (
                                                                                <div className="flex items-center justify-center gap-1 text-xs text-green-600 dark:text-green-400">
                                                                                    <CheckCircle className="w-3 h-3" />
                                                                                    <span>Available</span>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-xs text-slate-400 dark:text-zinc-600">N/A</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredMaterials.length === 0 && (
                                <div className="text-center py-12 sm:py-20">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 dark:bg-zinc-800">
                                        <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 dark:text-white">No materials found</h3>
                                    <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showDonateModal && selectedDownloadSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📚</span>
                                    <h2 className="text-sm font-bold">Download Your Book</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDonateModal(false);
                                        setCustomerEmail('');
                                        setCustomerName('');
                                        setDonationAmount('');
                                    }}
                                    className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <p className="text-xs text-white/80 mt-0.5 truncate">{selectedDownloadSubject.name}</p>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">

                            {/* User Info */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-zinc-300 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full px-2.5 py-1.5 text-sm border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-zinc-300 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-2.5 py-1.5 text-sm border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Donation Section */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
                                    <span>💝</span> Support Us (Optional)
                                </p>

                                <div className="flex gap-2 mb-2">
                                    {[20, 50, 100, 200].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setDonationAmount(amount)}
                                            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${donationAmount === amount
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                                                : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 hover:border-green-300'
                                                }`}
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 dark:text-zinc-400">Custom:</span>
                                    <input
                                        type="number"
                                        value={donationAmount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setDonationAmount(val === '' ? '' : parseInt(val) || '');
                                        }}
                                        min="20"
                                        placeholder="Min ₹20"
                                        className="flex-1 px-2 py-1 text-sm border border-green-200 dark:border-green-700 rounded-md focus:ring-1 focus:ring-green-500 outline-none dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>

                                <p className="text-center text-xs text-slate-500 dark:text-zinc-400 mt-2">
                                    ✨ Every ₹1 helps us serve 10 more students!
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={handleDonateAndDownload}
                                    disabled={!customerEmail || !customerName || isProcessingPayment || !donationAmount || donationAmount < 20}
                                    className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessingPayment ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <>💝 Donate {donationAmount ? '₹' + donationAmount : ''} and Download</>
                                    )}
                                </button>

                                <button
                                    onClick={handleFreeDownload}
                                    disabled={!customerEmail || !customerName || isLoadingDownload}
                                    className="w-full py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                                >
                                    {isLoadingDownload ? (
                                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Download className="w-3.5 h-3.5" /> Continue Without Donating</>
                                    )}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500">
                                <Lightbulb className="w-3 h-3" />
                                <span>🔒 Secure payment via Razorpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Not Found Modal */}
            {showBookNotFoundModal && notFoundSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full dark:bg-zinc-900">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">Book Not Available</h2>
                                    <p className="text-sm text-white/90 mt-0.5">{notFoundSubject.name}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowBookNotFoundModal(false);
                                        setNotFoundSubject({ name: '', code: '' });
                                    }}
                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-amber-900/30">
                                <FileQuestion className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>

                            {/* Message */}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">
                                    Book Currently Unavailable
                                </h3>
                                <p className="text-sm text-slate-600 mb-4 dark:text-zinc-400">
                                    The Quantum book for <strong className="dark:text-white">{notFoundSubject.code}</strong> is not available yet.
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 dark:bg-blue-900/20 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 dark:text-blue-400" />
                                    <div className="text-sm text-slate-700 dark:text-zinc-300">
                                        <p className="font-semibold mb-1">What you can do:</p>
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>Check other available study materials (PYQ, Notes, Syllabus)</li>
                                            <li>Contact us to request this book</li>
                                            <li>Check back later for updates</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowBookNotFoundModal(false);
                                        setNotFoundSubject({ name: '', code: '' });
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        alert('We will notify you when this book becomes available!');
                                        setShowBookNotFoundModal(false);
                                        setNotFoundSubject({ name: '', code: '' });
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                                >
                                    Notify Me
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* PYQ Modal*/}
            {/* PYQ Years Modal */}
            {showMaterialModal && selectedMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full dark:bg-zinc-900">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">{selectedMaterial.subject}</h2>
                                    <p className="text-xs text-white/80">{selectedMaterial.code}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowMaterialModal(false);
                                        setSelectedMaterial(null);
                                    }}
                                    className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-96 overflow-y-auto">
                            <div className="space-y-2">
                                {selectedMaterial.data.years.map((yearData, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <FileQuestion className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    Year {yearData.year}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                    {yearData.items.length} paper{yearData.items.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(yearData.items[0].link)}
                                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* SEO Content Section */}
            <div className="relative px-4 sm:px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            AKTU B.Tech Computer Science Engineering Study Materials
                        </h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-600 dark:text-zinc-400 space-y-4">
                            <p>
                                Welcome to the most comprehensive collection of <strong>Dr. APJ Abdul Kalam Technical University (AKTU)</strong> study materials for B.Tech Computer Science & Engineering students. Access free PDF downloads including syllabus, previous year question papers (PYQ), Quantum series books, and handwritten notes for all 8 semesters.
                            </p>
                            <p>
                                Our collection covers essential CSE subjects including <strong>Data Structures (BCS301)</strong>, <strong>Database Management System (BCS501)</strong>, <strong>Computer Networks (BCS603)</strong>, <strong>Software Engineering (BCS601)</strong>, <strong>Compiler Design (BCS602)</strong>, <strong>Artificial Intelligence (BCS701)</strong>, and many more as per the latest AKTU syllabus 2024-25.
                            </p>
                            <p>
                                Whether you're preparing for semester exams, looking for solved question papers, or need quick revision notes, AKTU Helper provides all resources in one place. Download Quantum books PDF, access year-wise PYQ papers from 2019-2024, and get updated syllabus for each semester.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
           
                   
            {/* Disclaimer Section */}
            <div className="relative px-4 sm:px-6 pb-12 sm:pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 dark:bg-blue-900/10 dark:border-blue-800">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 dark:text-blue-400">
                                    ⚠️ Disclaimer
                                </h3>
                                <div className="text-sm sm:text-base text-blue-800 dark:text-blue-300 space-y-2">
                                    <p>
                                        The PDF notes and study materials shared on this website, including content from sources like Quantum Series, educational websites, and Telegram channels, are intended for <strong>educational purposes only</strong>. We do not claim ownership of any materials unless explicitly mentioned. All rights belong to the original creators or publishers.
                                    </p>
                                    <p>
                                        If you are the rightful owner of any content published here and wish for it to be removed, please contact us with proper verification. We will promptly take down the content upon receiving your request.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    }
