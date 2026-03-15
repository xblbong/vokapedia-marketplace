import NavbarComponent from "@/src/components/layouts/NavbarComponent";
import Footer from "@/src/components/layouts/Footer";
import { Suspense } from "react";
import { prisma } from "@/src/lib/prisma";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const menuDataRaw = await prisma.menuOverlayItem.findMany({
        orderBy: [
            { sectionName: 'asc' },
            { order: 'asc' }
        ]
    });

    const overlayMenu = Object.values(menuDataRaw.reduce((acc, item) => {
        if (!acc[item.sectionName]) {
            acc[item.sectionName] = { title: item.sectionName, items: [] };
        }
        acc[item.sectionName].items.push({ label: item.label, href: item.url });
        return acc;
    }, {} as Record<string, { title: string, items: { label: string, href: string }[] }>));

    return (
        <>
            <Suspense fallback={null}>
                <NavbarComponent overlayMenu={overlayMenu} />
            </Suspense>
            {children}
            <Footer />
        </>
    );
}
