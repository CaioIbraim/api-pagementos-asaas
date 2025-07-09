import axios from 'axios';

const ASAAS_API = 'https://api-sandbox.asaas.com/v3/payments';
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

export async function POST() {
    try {
        const response = await axios.post(
            ASAAS_API, {
                customer: "6817605",
                billingType: 'PIX',
                value: 29.9,
                dueDate: new Date().toISOString().split('T')[0],
            }, {
                headers: {
                    Authorization: `Bearer ${ASAAS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return Response.json({
            paymentId: response.data.id,
            qrCodeImage: response.data.pixQrCode.encodedImage,
            payload: response.data.pixQrCode.payload,
        });
    } catch (error) {
        console.error(error.response);
        return Response.json({ error: 'Erro ao gerar pagamento' }, { status: 500 });
    }
}