import axios from "axios";

export const StoreService = {
    getAllStores: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/store');
        return res.data.content;
    }
};