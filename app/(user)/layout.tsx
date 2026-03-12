import NavbarComponent from "@/src/components/layouts/NavbarComponent";
import Footer from "@/src/components/layouts/Footer";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavbarComponent />
            {children}
            <Footer />
        </>
    );
}
