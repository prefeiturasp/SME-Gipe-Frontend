import axios from "axios";

const apiAnexos = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ANEXOS_URL,
});

export default apiAnexos;
