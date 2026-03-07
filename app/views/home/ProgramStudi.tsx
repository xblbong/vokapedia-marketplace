import Image from "next/image";

const PRODI_DATA = [
  {
    title: "Teknologi Informasi",
    desc: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan berbasis standar industri.",
    icon: "images/svg/icons/ti.svg",
  },
  {
    title: "Administrasi Bisnis",
    desc: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan berbasis standar industri.",
    icon: "images/svg/icons/adbis.svg",
  },
  {
    title: "Keuangan & Perbankan",
    desc: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan berbasis standar industri.",
    icon: "images/svg/icons/keubank.svg",
  },
  {
    title: "Manajemen Perhotelan",
    desc: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan berbasis standar industri.",
    icon: "images/svg/icons/mp.svg",
  },
  {
    title: "Desain Grafis",
    desc: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan berbasis standar industri.",
    icon: "images/svg/icons/dg.svg",
  },
];

export default function ProgramStudi() {
  return (
    <section className="flex flex-col items-center gap-[60px]">
      
      {/* Header Section */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-[30px] md:text-[38px] font-semibold text-[#000000]">
          Program Studi Fakultas Vokasi
        </h2>
        <p className="text-[22px] md:text-[24px] text-[#7F7F7F] font-normal">
          Universitas Brawijaya
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-[24px] w-full">
        {PRODI_DATA.map((prodi, index) => (
          <div 
            key={index}
            className="w-full sm:w-[280px] md:w-[230px] lg:w-[250px] min-h-[200px] bg-white border border-[#C3C3C3] rounded-[20px] p-[24px] flex flex-col items-center text-center gap-[20px] hover:border-black hover:shadow-xl transition-all duration-300 group cursor-default"
          >
            {/* Icon Box */}
            <div className="w-[80px] h-[80px] relative flex items-center justify-center transition-transform group-hover:scale-110">
              <Image 
                src={prodi.icon} 
                alt={prodi.title} 
                width={70} 
                height={70} 
                className="object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-[16px] font-bold text-[#1E1E1E] leading-tight px-2">
              {prodi.title}
            </h3>

            {/* Description */}
            <p className="text-[10px] text-[#8F8F8F] leading-[1.6] font-normal">
              {prodi.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}