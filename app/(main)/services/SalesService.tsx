import axios from "axios";

export const SalesService = {
    getAllSales: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales');
        return res.data.content;
    },

    getTotalSalesGroupByStore: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesGroupStore');
        return res.data;
    },

    getSalesTotalGrupByMonths: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesGroupMonth');
        return res.data;
    },

    getSalesThisMonth: async (): Promise<number> => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesActualMonth');
        return res.data;
    },

    getSalesByDateRange: async (dateRange: any[]) => {

        if (dateRange[1] !== null) {
            const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesByDateRange', {
                params: {
                    startDate: dateRange[0],
                    endDate: dateRange[1]
                }
            });
            return res.data;
        } else {
            const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesByDateRange', {
                params: {
                    startDate: dateRange[0],
                }
            });
            return res.data;
        }
    },

    getSalesToday: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesByDay');
        return res.data;
    },

    getTotalSales: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/totalSales');
        return res.data;
    },

    getTotalSalesThisYear: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/totalSalesByYear');
        return res.data;
    },

    getProductMoreSoldAndLessSold: async () => {
        const res = await axios.get('http://localhost:8080/api/v1/sales/productsMoreSoldAndLessSold');
        return res.data;
    },

}