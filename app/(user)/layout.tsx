import NavbarComponent from "@/src/components/layouts/NavbarComponent";
import Footer from "@/src/components/layouts/Footer";
import { Suspense } from "react";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={null}>
                <NavbarComponent />
            </Suspense>
            {children}
            <Footer />
        </>
    );
}
