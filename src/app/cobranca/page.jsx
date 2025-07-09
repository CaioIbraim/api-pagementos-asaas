import PixPayment from '@/components/PixPayment';

export default function CobrancaPix() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Gerar Cobrança PIX</h1>
      <PixPayment />
    </main>
  );
}