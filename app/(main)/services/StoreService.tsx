import axios from "axios";

export const StoreService = {
    getAllStores: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/store');
        return res.data.content;
    },

    getAllDepartments: async () => {
        const res = await axios.get('https://api-colombia.com/api/v1/Department');
        return res.data;
    },

    getAllCitiesByDepartmentId: async (departmentId: number) => {
        const res = await axios.get(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`);
        return res.data;
    },

    createStore: async (data: any) => {
        const res = await axios.post('http://localhost:8080/api/v1/store', {
            "name": data.name,
            // pasar de (+57) 999-999-9999 a +579999999999
            "phone": data.phone.replace(/[^0-9+]/g, ''),
            "color": `#${data.color}`,
            "address": {
                "street": data.street,
                "city": data.city.name,
                "department": data.department.name,
                "country": "Colombia"
            }
        });
        return res.data;
    }
};