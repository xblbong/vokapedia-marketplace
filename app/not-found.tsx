import ErrorState from "@/src/components/shared/ErrorState";

export default function NotFound() {
  return (
    <main className="bg-white">
      <ErrorState 
        title="Aduh, Nyasar Ya?"
        message="Halaman yang kamu tuju tidak ada di peta kami. Mungkin kamu mengetik alamat yang salah atau halamannya sudah kami pindahkan."
        suggestion="Jangan khawatir, kamu bisa kembali ke jalan yang benar dengan tombol di bawah."
      />
    </main>
  );
}