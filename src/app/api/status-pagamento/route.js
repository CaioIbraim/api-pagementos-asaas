import axios from 'axios';

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
        return Response.json({ error: 'paymentId é obrigatório' }, { status: 400 });
    }

    try {
        const response = await axios.get(
            `https://api-sandbox.asaas.com/api/v3/payments/ ${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${ASAAS_TOKEN}`,
                },
            }
        );

        return Response.json({ status: response.data.status });
    } catch (error) {
        console.error(error.response);
        return Response.json({ error: 'Erro ao verificar status' }, { status: 500 });
    }
}