import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[#00122F] text-white pt-[80px]">
            <div className="layout-container pb-[60px]">
                {/* Gunakan Flex sesuai permintaan kamu */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-20">

                    {/* Column 1: Logos & Addresses */}
                    <div className="flex flex-col gap-10">
                        {/* Logos Group */}
                        <div className="flex items-center gap-6 mb-4">
                            <Image src="/images/svg/logo/ub.svg" alt="UB" width={43} height={44} className="object-contain" />
                            <Image src="/images/svg/logo/vokasi.svg" alt="Vokasi UB" width={40} height={42} className="object-contain" />
                            <Image src="/images/svg/logo/bik.svg" alt="BIK" width={70} height={37} className="object-contain" />
                        </div>

                        {/* Addresses Row */}
                        <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                            <div className="flex flex-col max-w-[280px]">
                                <h4 className="text-[14px] mb-2 font-bold">Main Campus</h4>
                                <p className="text-[14px] leading-[1.6] opacity-80 font-normal">
                                    Jl. Veteran No 12 – 14, Ketawanggede, Malang, Jawa Timur, Indonesia
                                </p>
                            </div>
                            <div className="flex flex-col max-w-[280px]">
                                <h4 className="text-[14px] mb-2 font-bold">Dieng Campus</h4>
                                <p className="text-[14px] opacity-80 font-normal">
                                    Jl. Puncak Dieng, Kunci, Kalisongo, Kec. Dau, Kabupaten Malang, Jawa Timur, 65151, Indonesia
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Contact Us */}
                    <div className="flex flex-col min-w-[200px]">
                        <h4 className="text-[14px] font-bold mb-4">Contact Us</h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center gap-4 text-[14px] opacity-90 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/global-line.svg" alt="Web" width={22} height={22} />
                                <a href="https://vokasi.ub.ac.id" target="_blank">vokasi.ub.ac.id</a>
                            </li>
                            <li className="flex items-center gap-4 text-[14px] opacity-90 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/whatsapp-line.svg" alt="WA" width={22} height={22} />
                                <span>0896-5294-4096</span>
                            </li>
                            <li className="flex items-center gap-4 text-[14px] opacity-90 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/tiktok-line.svg" alt="Tiktok" width={22} height={22} />
                                <span>@vokasiub</span>
                            </li>
                            <li className="flex items-center gap-4 text-[14px] opacity-90 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/instagram-line.svg" alt="IG" width={22} height={22} />
                                <span>@vokasiub</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Email Section (Fix Button Style) */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[14px] font-bold">Email</h4>
                        <button className="w-[227px] h-[36px] px-[60px] py-[8px] gap-[10px] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-[10px] transition-all duration-300 flex items-center justify-center whitespace-nowrap hover:bg-white/20 hover:border-white/40">
                            <span className="text-[14px] font-medium text-white leading-none tracking-tight">
                                Connect with Us
                            </span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Copyright Bar */}
            <div className="w-full bg-[#002663] py-6">
                <div className="layout-container flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[14px] opacity-80">
                        Copyright © 2026 PSIK Fakultas Vokasi Universitas Brawijaya
                    </p>
                    <div className="flex gap-8 text-[14px] opacity-80">
                        <Link href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
                        <Link href="#" className="hover:opacity-100 transition-opacity">Term of Service</Link>
                        <Link href="#" className="hover:opacity-100 transition-opacity">Site Map</Link>
                    </div>
                </div>
            </div>

            {/* Floating WA */}
            <Link
                href="https://wa.me/6289652944096"
                target="_blank"
                className="fixed bottom-10 right-10 z-50 hover:scale-110 transition-transform active:scale-95"
            >
                <Image src="/images/svg/icons/wa.svg" alt="WA" width={75} height={75} className="drop-shadow-2xl" />
            </Link>
        </footer>
    );
}