"use client"
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X, Search, Code, Users, BarChart, Shield, Briefcase, Folder, Notebook } from "lucide-react";
import Link from "next/link";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState({});
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProfileOpen, setProfileOpen] = useState(false);
    const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

    const megaMenuCategories = [
        {
            title: "Popular Courses",
            items: [
                {
                    icon: Code,
                    title: "Btech",
                    href: "#",
                    desc: "Bachelor of Technology",
                    submenu: [
                        { title: "Computer Science & Engineering", href: "/computer_Science" },
                        { title: "Electronics & Communication", href: "/ece" },
                        { title: "Electrical Enginerring", href: "/ee" },
                        { title: "Mechanical Engineering", href: "/me" },
                        { title: "Civil Engineering", href: "/civil" },
                    ]
                },
                { icon: Shield, title: "BPharma", desc: "Bachelor of Pharmacy", href: "/bpharma" },
                { icon: Briefcase, title: "MBA", desc: "Master of Business Administration", href: "/mba" },
                { icon: Code, title: "BCA", desc: "Bachelor of Computer Applications", href: "/bca" },
                { icon: Code, title: "MCA", desc: "Master of Computer Applications", href: "/mca" },
            ]
        },
        {
            title: "Placement Support",
            items: [
                { icon: BarChart, title: "Aptitude", href: "/aptitude" },
                { icon: Users, title: "Interview Questions", href: "/interview" },
                { icon: Folder, title: "Projects", href: "/proj" },
            ]
        },
        {
            title: "Others",
            items: [
                { icon: Notebook, title: "Result", href: "/result" },
                { icon: Briefcase, title: "UP Scholarship", href: "/Scloarship" },
                { icon: BarChart, title: "Privacy Policy", href: "/privacy" },
                { icon: Shield, title: "Terms & Conditions", href: "/Terms" },
            ]
        },
    ];

    const toggleMobileSubmenu = (itemTitle) => {
        setMobileSubmenuOpen(prev => ({
            ...prev,
            [itemTitle]: !prev[itemTitle]
        }));
    };

    return (
        <div className="sticky top-0 z-50">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md dark:shadow-zinc-900/50 border-b border-theme">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a className="flex items-center gap-2" href="#">
                        <img src="/logo_192.png" alt="Brand Logo" className="w-15 h-15 sm:w-15 sm:h-15" />
                        <span className="hidden sm:block text-xl font-bold tracking-wider uppercase">
                            <span className="text-theme-primary">AKTU</span>
                            <span className="text-blue-600 dark:text-blue-400">HELPER</span>
                        </span>
                    </a>

                    <nav aria-label="Global" className="hidden lg:block">
                        <ul className="flex items-center gap-1">
                            <li>
                                <a className="px-4 py-2 text-theme-primary font-medium transition hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30" href="/">
                                    Home
                                </a>
                            </li>

                            <li className="relative group">
                                <button
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                    className="px-4 py-2 text-theme-primary font-medium transition hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-1"
                                >
                                    Explore
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                        className="absolute left-0 mt-2 w-[900px] bg-theme-card shadow-2xl dark:shadow-zinc-900/50 border border-theme rounded-2xl overflow-hidden"
                                        style={{ animation: 'fadeIn 0.2s ease-in-out' }}
                                    >
                                        <div className="p-8">
                                            <div className="grid grid-cols-3 gap-8">
                                                {megaMenuCategories.map((category, catIndex) => (
                                                    <div key={catIndex}>
                                                        <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-4 px-2">
                                                            {category.title}
                                                        </h3>
                                                        <div className="space-y-1">
                                                            {category.items.map((item, itemIndex) => {
                                                                const Icon = item.icon;
                                                                return (
                                                                    <div key={itemIndex} className="relative group/item">
                                                                        <a
                                                                            href={item.href}
                                                                            className="group/link flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                                                                        >
                                                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center group-hover/link:bg-blue-200 dark:group-hover/link:bg-blue-800/50 transition-colors shrink-0">
                                                                                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-1">
                                                                                    <h4 className="font-semibold text-sm text-theme-primary group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                                                                                        {item.title}
                                                                                    </h4>
                                                                                    {item.submenu && (
                                                                                        <ChevronRight className="w-3 h-3 text-theme-muted" />
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-xs text-theme-secondary mt-0.5">
                                                                                    {item.desc}
                                                                                </p>
                                                                            </div>
                                                                        </a>

                                                                        {item.submenu && (
                                                                            <div className="absolute left-full top-0 ml-2 w-64 bg-theme-card shadow-xl dark:shadow-zinc-900/50 border border-theme rounded-xl p-3 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 z-10">
                                                                                <div className="space-y-1">
                                                                                    {item.submenu.map((subItem, subIndex) => (
                                                                                        <a
                                                                                            key={subIndex}
                                                                                            href={subItem.href}
                                                                                            className="block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition group/sub"
                                                                                        >
                                                                                            <div className="font-medium text-sm text-theme-primary group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400 transition-colors">
                                                                                                {subItem.title}
                                                                                            </div>
                                                                                        </a>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li>
                                <Link className="px-4 py-2 text-theme-primary font-medium transition hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30" href="/campusconnecthome">
                                    CampusConnect
                                </Link>
                            </li>
                            <li>
                                <Link className="px-4 py-2 text-theme-primary font-medium transition hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30" href="/jobs">
                                    Jobs
                                </Link>
                            </li>
                            <li>
                                <Link className="px-4 py-2 text-theme-primary font-medium transition hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30" href="/Contact">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link className="px-4 py-2 text-theme-primary font-medium transition hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30" href="/About">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                placeholder="Search resources, docs, templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-zinc-900 border border-theme rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-theme-primary"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                            onClick={() => setSearchOpen(!isSearchOpen)}
                            className="lg:hidden rounded-lg bg-gray-100 dark:bg-zinc-800 p-2 text-gray-600 dark:text-zinc-400 transition hover:bg-gray-200 dark:hover:bg-zinc-700"
                            aria-label="Toggle search"
                        >
                            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </button>
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-lg transition hover:opacity-80"
                                    aria-label="User menu"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow">
                                        {user?.picture ? (
                                            <img
                                                src={user.picture}
                                                alt={user.given_name || "User"}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg">
                                                {user?.given_name?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setProfileOpen(false)}
                                        ></div>

                                        <div className="absolute right-0 mt-3 w-72 bg-theme-card rounded-2xl shadow-2xl dark:shadow-zinc-900/50 border border-theme overflow-hidden z-50 animate-slideDown">
                                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 text-white">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                                                        {user?.picture ? (
                                                            <img
                                                                src={user.picture}
                                                                alt={user.given_name || "User"}
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>
                                                                {user?.given_name?.charAt(0)?.toUpperCase() || "U"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-lg truncate">
                                                            {user?.given_name} {user?.family_name}
                                                        </h3>
                                                        <p className="text-sm text-white/80 truncate">
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <div className="my-2 border-t border-theme"></div>
                                                <LogoutLink className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all group w-full">
                                                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
                                                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <span className="font-medium">Logout</span>
                                                </LogoutLink>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <LoginLink className="hidden md:block rounded-lg bg-gray-100 dark:bg-zinc-800 px-4 lg:px-5 py-2 text-sm font-medium text-theme-primary transition-all hover:bg-gray-200 dark:hover:bg-zinc-700 hover:shadow-md">
                                    Login
                                </LoginLink>
                                <RegisterLink className="hidden md:block rounded-lg bg-blue-600 dark:bg-blue-500 px-4 lg:px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg">
                                    Get Started
                                </RegisterLink>
                            </>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden rounded-lg bg-gray-100 dark:bg-zinc-800 p-2 text-gray-600 dark:text-zinc-400 transition hover:bg-gray-200 dark:hover:bg-zinc-700"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className="lg:hidden px-4 pb-4 border-t border-theme bg-theme-card animate-slideDown">
                        <div className="relative mt-3 group">
                            <input
                                type="text"
                                placeholder="Search resources, docs, templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 text-sm bg-gray-50 dark:bg-zinc-900 border border-theme rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-theme-primary"
                                autoFocus
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-theme bg-theme-card max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <nav className="px-4 py-4 space-y-2">
                            <Link href="/" className="block px-4 py-3 text-theme-primary font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Home
                            </Link>

                            <div className="space-y-2">
                                <button
                                    onClick={() => setMobileSubmenuOpen(prev => ({ ...prev, explore: !prev.explore }))}
                                    className="w-full flex items-center justify-between px-4 py-3 font-medium text-theme-primary rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                >
                                    Explore
                                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenuOpen.explore ? 'rotate-180' : ''}`} />
                                </button>

                                {mobileSubmenuOpen.explore && (
                                    <div className="pl-4 space-y-2">
                                        {megaMenuCategories.map((category, catIndex) => (
                                            <div key={catIndex} className="space-y-1">
                                                <button
                                                    onClick={() => toggleMobileSubmenu(category.title)}
                                                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-theme-muted uppercase tracking-wider rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                                >
                                                    {category.title}
                                                    <ChevronDown className={`w-3 h-3 transition-transform ${mobileSubmenuOpen[category.title] ? 'rotate-180' : ''}`} />
                                                </button>

                                                {mobileSubmenuOpen[category.title] && (
                                                    <div className="pl-4 space-y-1">
                                                        {category.items.map((item, itemIndex) => {
                                                            const Icon = item.icon;
                                                            const hasSubmenu = item.submenu && item.submenu.length > 0;
                                                            const isOpen = mobileSubmenuOpen[item.title];

                                                            return (
                                                                <div key={itemIndex} className="space-y-1">
                                                                    <div className="flex items-center">
                                                                        <a
                                                                            href={item.href}
                                                                            className="flex items-center gap-3 px-4 py-2 text-theme-primary rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition flex-1"
                                                                        >
                                                                            <Icon className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="font-medium text-sm">{item.title}</div>
                                                                                <div className="text-xs text-theme-secondary">{item.desc}</div>
                                                                            </div>
                                                                        </a>

                                                                        {hasSubmenu && (
                                                                            <button
                                                                                onClick={() => toggleMobileSubmenu(item.title)}
                                                                                className="p-2 text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                                                            >
                                                                                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {hasSubmenu && isOpen && (
                                                                        <div className="pl-6 pr-4 space-y-1 pb-2">
                                                                            {item.submenu.map((subItem, subIndex) => (
                                                                                <a
                                                                                    key={subIndex}
                                                                                    href={subItem.href}
                                                                                    className="block px-4 py-2 text-sm text-theme-primary rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                                                                >
                                                                                    <div className="font-medium">{subItem.title}</div>
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <a href="/campusconnecthome" className="block px-4 py-3 text-theme-primary font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                campusconnect
                            </a>
                            <a href="/jobs" className="block px-4 py-3 text-theme-primary font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Jobs
                            </a>
                            <a href="/Contact" className="block px-4 py-3 text-theme-primary font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Contact
                            </a>
                            <a href="/About" className="block px-4 py-3 text-theme-primary font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                About
                            </a>

                            <div className="pt-4 space-y-2 border-t border-theme mt-4">
                                {isAuthenticated ? (
                                    <div className="space-y-2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl p-4 text-white">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/30">
                                                    {user?.picture ? (
                                                        <img
                                                            src={user.picture}
                                                            alt={user.given_name || "User"}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>
                                                            {user?.given_name?.charAt(0)?.toUpperCase() || "U"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold truncate">
                                                        {user?.given_name} {user?.family_name}
                                                    </h3>
                                                    <p className="text-sm text-white/80 truncate">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <LogoutLink className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 transition backdrop-blur-sm w-full">
                                                    <X className="w-4 h-4" />
                                                    <span className="font-medium text-sm">Logout</span>
                                                </LogoutLink>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <LoginLink className="block px-4 py-3 text-center text-theme-primary font-medium rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                                            Login
                                        </LoginLink>
                                        <RegisterLink className="block px-4 py-3 text-center text-white font-medium rounded-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                                            Get Started
                                        </RegisterLink>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}