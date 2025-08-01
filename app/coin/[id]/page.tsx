import { CoinDetails } from "@/components/coin-details";

interface CoinPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoinPage({ params }: CoinPageProps) {
  const { id } = await params;
  return <CoinDetails coinId={id} />;
}
