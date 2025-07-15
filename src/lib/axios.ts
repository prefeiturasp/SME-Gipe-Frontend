import axios from "axios";

export default axios.create({
    baseURL: process.env.AUTENTICA_CORESSO_API_URL,
});
