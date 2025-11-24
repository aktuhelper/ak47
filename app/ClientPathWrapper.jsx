"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_HomePage_Components/Navbar";
import Footer from "./_HomePage_Components/Footer";
import TelegramButton from "./_HomePage_Components/TelegramButton";
import AktuheperChatbot from "./_HomePage_Components/AktuheperChatbot";

export default function ClientPathWrapper({ children }) {
    const pathname = usePathname();

    const hideFooterRoutes = [
        "/campusconnecthome",
        "/dashboard",
        "/seniors",
        "/juniors",
        "/queries",
        "/trending-queries",
    ];

    const shouldHideFooter = hideFooterRoutes.some((route) =>
        pathname?.startsWith(route)
    );

    return (
        <>
            <Navbar />
            <main>{children}</main>
            {!shouldHideFooter && <Footer />}
            <TelegramButton />
            <AktuheperChatbot />
        </>
    );
}
