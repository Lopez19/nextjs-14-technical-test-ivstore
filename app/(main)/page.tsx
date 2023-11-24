'use client';

import React, {useEffect, useState} from 'react';
import CardComponentSmall from "@/app/(main)/components/CardComponentSmall";
import {SalesService} from "@/app/(main)/services/SalesService";
import ChartPieComponent from "@/app/(main)/components/ChartPieComponent";
import ChartBarComponent from "@/app/(main)/components/ChartBarComponent";
import {Calendar} from 'primereact/calendar';
import {Button} from 'primereact/button';
import CardProductMoreSaleComponent from './components/CardProductMoreSaleComponent';

const Analytics = () => {

    const [totalSales, setTotalSales] = useState({});
    const [totalSalesToday, setTotalSalesToday] = useState({})
    const [totalSalesThisMonth, setTotalSalesThisMonth] = useState({})
    const [totalSalesThisYear, setTotalSalesThisYear] = useState({})

    const [chartDataPie, setChartDataPie] = useState({});
    const [chartOptionsPie, setChartOptionsPie] = useState({});

    const [chartDataBar, setChartDataBar] = useState({});
    const [chartOptionsBar, setChartOptionsBar] = useState({});

    const [dateRange, setDateRange] = useState<any>(null);

    const [productMoreAndLessSold, setProductMoreAndLessSold] = useState([{}])

    useEffect(() => {
        SalesService.getTotalSales().then((res) => {
            setTotalSales(res);
        });

        SalesService.getTotalSalesThisYear().then((res) => {
            setTotalSalesThisYear(res);
        });

        SalesService.getSalesThisMonth().then((res) => {
            setTotalSalesThisMonth(res);
        });

        SalesService.getSalesToday().then((res) => {
            setTotalSalesToday(res);
        });

        SalesService.getProductMoreSoldAndLessSold().then((res) => {
            setProductMoreAndLessSold(res);
        });
    }, []);

    /*PieChart*/
    useEffect(() => {
        loadChartPie();
    }, []);

    function loadChartPie() {
        SalesService.getTotalSalesGroupByStore().then((res) => {
            const documentStyle = getComputedStyle(document.documentElement);

            const data = {
                labels: res.map((item: any) => item.nameStore),
                datasets: [
                    {
                        data: res.map((item: any) => item.totalSalesAmount.toFixed(2)),
                        backgroundColor: res.map((item: any) => item.color)
                    }
                ]
            }

            const options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            }

            setChartDataPie(data);
            setChartOptionsPie(options)
        });
    };

    /*BarChart*/
    useEffect(() => {
        loadChartBar();
    }, []);

    function loadChartBar() {
        SalesService.getSalesTotalGrupByMonths().then((res) => {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            // Solo para obtener los meses en los que se vendio
            // const salesForMonthStrings = Array.from(new Set(res.map((item: any) =>
            //     new Set(item.salesForMonth)
            //         .keys()
            //         .next()
            //         .value)
            // ));

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const data = {

                    labels: months,
                    datasets: [
                        {
                            label: 'Sales',
                            data: res.map((item: any) => item.totalSales),
                            backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                            borderColor: documentStyle.getPropertyValue('--primary-500'),
                            borderWidth: 1,
                            borderRadius: 4,
                        }
                    ],
                }
            ;

            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };

            setChartDataBar(data);
            setChartOptionsBar(options);
        });
    }

    /*Calendar Filter*/
    const calendarFilter = () => {
        SalesService.getSalesByDateRange(dateRange).then((res) => {
            setTotalSales(res.totalSalesForever);

            const documentStyle = getComputedStyle(document.documentElement);

            const data = {
                labels: res.salesByStore.map((item: any) => item.nameStore),
                datasets: [
                    {
                        data: res.salesByStore.map((item: any) => item.totalSalesAmount.toFixed(2)),
                        backgroundColor: res.salesByStore.map((item: any) => item.color),
                    }
                ]
            }

            const options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            }

            setChartDataPie(data);
            setChartOptionsPie(options)

        });
    }

    /*Clear Filters*/
    const clearFilters = () => {
        SalesService.getTotalSales().then((res) => {
            setTotalSales(res);
        });
        loadChartPie();
    }

    // @ts-ignore
    return (
        <div className="grid">
            <div className={`col-12`}>
                <div className="grid">
                    <div className="col-9 col-md-6">
                        <Calendar
                            className={`w-full`}
                            value={dateRange}
                            onChange={(event) => setDateRange(event.value)}
                            onClearButtonClick={() => setDateRange(null)}
                            showButtonBar={true}
                            selectionMode="range"
                            showIcon={true}
                            dateFormat="dd-mm-yy"
                        />
                    </div>
                    <div className="col">
                        <Button icon={`pi pi-search`} onClick={calendarFilter} className={`w-full`}/>
                    </div>
                    <div className="col">
                        <Button icon={`pi pi-filter-slash`} onClick={clearFilters} className={`w-full`}/>
                    </div>
                </div>
            </div>

            <CardComponentSmall
                key={"1"}
                title={"Total Sales"}
                value={`${totalSales.totalAmountForever?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} | ${totalSales?.totalSalesForever}`}
                icon={"pi-money-bill"}
                color={"blue"}
                nuevoValue={"+30%"}
                nuevoValueColor={"green"}
                textDescription={"Last 30 days"}
            ></CardComponentSmall>
            <CardComponentSmall
                key={"2"}
                title={"Total Sales Day"}
                value={`${totalSalesToday.totalAmount?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} | ${totalSalesToday?.totalSales}`}
                icon={"pi-money-bill"}
                color={"green"}
                nuevoValue={"0%"}
                textDescription={""}
            ></CardComponentSmall>
            <CardComponentSmall
                key={"3"}
                title={"Total Month"}
                value={`${totalSalesThisMonth.totalAmount?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} | ${totalSalesThisMonth?.totalSales}`}
                icon={"pi-money-bill"}
                color={"pink"}
                nuevoValue={"+5%"}
                nuevoValueColor={"green"}
                textDescription={"More than last month"}
            ></CardComponentSmall>
            <CardComponentSmall
                key={"4"}
                title={"Total Year"}
                value={`${totalSalesThisYear.totalAmountYear?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} | ${totalSalesThisYear?.totalSalesYear}`}
                icon={"pi-money-bill"}
                color={"yellow"}
                nuevoValue={"0%"}
                textDescription={"More than last year"}
            ></CardComponentSmall>

            <ChartPieComponent
                chartData={chartDataPie}
                chartOptions={chartOptionsPie}
            ></ChartPieComponent>

            <div className={`col-12 lg:col-3 xl:col-3`}>
                <CardProductMoreSaleComponent
                    title={"Product More Sold"}
                    content={productMoreAndLessSold[0]?.productName}
                />
                <div className={`mt-3`}>
                    <CardProductMoreSaleComponent
                        title={"Product Lees Sold"}
                        content={productMoreAndLessSold[productMoreAndLessSold.length - 1]?.productName}
                    />
                </div>
            </div>

            <div className={`col-12 lg:col-6 xl:col-6`}>
                <div className="row">
                    <div className={`card col-12`}>
                        <ChartBarComponent chartData={chartDataBar} chartOptions={chartOptionsBar}></ChartBarComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;