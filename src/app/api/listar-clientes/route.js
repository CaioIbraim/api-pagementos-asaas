import axios from 'axios';

const ASAAS_API = process.env.ASAAS_API_URL + '/customers';
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

export async function GET() {
    try {
        const response = await axios.get(ASAAS_API, {
            headers: {
                Authorization: `Bearer ${ASAAS_TOKEN}`,
            },
        });

        return Response.json(response.data);
    } catch (error) {
        console.error(error.response);
        return Response.json({ error: 'Erro ao listar clientes' }, { status: 500 });
    }
}