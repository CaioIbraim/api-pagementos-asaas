'use client';
import { useState, useEffect } from 'react';

export default function PixPayment() {
  const [qrCode, setQRCode] = useState('');
  const [payload, setPayload] = useState('');
  const [showPix, setShowPix] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [status, setStatus] = useState('');

  // Carregar clientes cadastrados
  useEffect(() => {
    async function loadClientes() {
      try {
        const res = await fetch('/api/listar-clientes');
        const data = await res.json();
        setClientes(data.items || []);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
      }
    }

    loadClientes();
  }, []);

  const handlePagar = async () => {
    if (!clienteSelecionado) {
      alert('Selecione um cliente.');
      return;
    }

    setStatus('');
    setShowPix(false);
    localStorage.removeItem('paymentId');

    try {
      const res = await fetch('/api/gerar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: clienteSelecionado }),
      });

      const data = await res.json();

      if (!data.paymentId) {
        alert('Erro ao gerar pagamento.');
        return;
      }

      setQRCode(data.qrCodeImage);
      setPayload(data.payload);
      setShowPix(true);
      localStorage.setItem('paymentId', data.paymentId);

      checkStatus();
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar pagamento.');
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(payload).then(() => {
      alert('Chave PIX copiada!');
    });
  };

  const checkStatus = () => {
    const interval = setInterval(async () => {
      const paymentId = localStorage.getItem('paymentId');
      if (!paymentId) return;

      try {
        const res = await fetch(`/api/status-pagamento?paymentId=${paymentId}`);
        const data = await res.json();

        if (data.status === 'RECEIVED') {
          clearInterval(interval);
          setStatus('success');
        } else if (data.status === 'EXPIRED') {
          clearInterval(interval);
          setStatus('expired');
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    }, 5000);
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Selecione o Cliente:</label>
        <select
          value={clienteSelecionado}
          onChange={(e) => setClienteSelecionado(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Selecione --</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.email}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePagar}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
      >
        Pagar R$29,90
      </button>

      {showPix && (
        <>
          <p className="mt-6 mb-2">Escaneie ou copie a chave:</p>
          {qrCode && (
            <img
              src={`image/png;base64,${qrCode}`}
              alt="QR Code PIX"
              className="mx-auto mb-4 w-48 h-48"
            />
          )}
          <pre
            onClick={copyPix}
            className="cursor-pointer bg-gray-100 p-2 rounded text-sm overflow-x-auto"
          >
            {payload}
          </pre>
        </>
      )}

      {status === 'success' && (
        <div className="mt-4 text-green-600 font-bold">
          ✅ Pagamento realizado com sucesso!
        </div>
      )}

      {status === 'expired' && (
        <div className="mt-4 text-red-600 font-bold">
          ❌ O pagamento expirou.
        </div>
      )}
    </div>
  );
}