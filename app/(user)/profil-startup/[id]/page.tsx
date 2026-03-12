import DetailProfilStartup from '@/src/views/profil-startup/DetailProfil';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <DetailProfilStartup id={resolvedParams.id} />
  );
}