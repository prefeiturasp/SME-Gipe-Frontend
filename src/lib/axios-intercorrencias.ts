import axios from "axios";

const apiIntercorrencias = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_INTERCORRENCIAS_URL,
});

export default apiIntercorrencias;
