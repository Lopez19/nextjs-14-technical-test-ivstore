'use client';

import React, {useEffect, useState} from 'react';
import {DataTable, DataTableFilterMeta} from 'primereact/datatable';
import {Column, ColumnFilterElementTemplateOptions} from 'primereact/column';
import {SalesService} from '../../services/SalesService';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {InputNumber, InputNumberChangeEvent} from 'primereact/inputnumber';
import {Calendar, CalendarChangeEvent} from 'primereact/calendar';

const defaultFilters: DataTableFilterMeta = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    total: {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}],
    },
    createdAt: {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}],
    },
};

const Sales = () => {

    const [data, setData] = useState([{}]);
    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => {
        SalesService.getAllSales().then((res) => {
            setData(getSales(res))
        })
        initFilters();
    }, []);

    //Transformando los datos de la API a formato de fecha
    const getSales = (data: any) => {
        return [...(data || [{}])].map((d) => {
            d.createdAt = new Date(d.createdAt);
            return d;
        });
    };

    /*Limpiar Filtros*/
    const clearFilter = () => {
        SalesService.getAllSales().then((res) => {
            setData(res)
        })
        initFilters();
    };

    /*Templates Body*/
    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
            weekday: "short",
        });
    };

    const createAtBodyTemplate = (rowData: {
        createdAt: string | number | Date;
    }) => {
        return formatDate(new Date(rowData.createdAt));
    };

    const currencyBodyTemplate = (rowData: {
        total: number;
    }) => {
        return (
            <span>{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(rowData.total)}</span>
        );
    };

    /* Botones de filtros personalizados

    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

    const filterFooterTemplate = () => {
        return <div className="px-3 pt-0 pb-3 text-center">Filter by Country</div>;
    };
     */

    /*Templates Filters*/
    const totalFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value}
                            onChange={(e: InputNumberChangeEvent) =>
                                options.filterCallback(e.value, options.index)
                            }
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                            placeholder="Search by Goal"
                            min={0}
        />;
    };

    const createdAtFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value}
                         onChange={(e: CalendarChangeEvent) =>
                             options.filterCallback(e.value, options.index)
                         }
                         dateFormat="dd/mm/yy"
                         placeholder="dd/mm/yy"
                         mask="99/99/9999"
                         showButtonBar
                         showIcon
        ></Calendar>;
    };

    /*Inicializar Filtros*/
    const initFilters = () => {
        setFilters(defaultFilters);
    };

    /*Render Header DataTable*/
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter}/>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>

                    <InputText type="search"
                               onInput={(e) =>
                                   setFilters({
                                       global: {value: e.currentTarget.value, matchMode: FilterMatchMode.CONTAINS}
                                   })
                               }
                               placeholder="Global Search"
                    />
                </span>
            </div>
        );
    };
    const header = renderHeader();

    return (
        <div className={`grid`}>
            <div className={`col-12 card`}>
                <DataTable
                    header={header}
                    value={data}
                    filters={filters}
                    sortField="createdAt"
                    sortOrder={-1}
                    removableSort
                    className={`p-datatable-hoverable-rows`}
                    size={"normal"}
                    showGridlines
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    emptyMessage="No sales found..."
                    filterDisplay="menu"
                >
                    <Column field="id"
                            header="ID"
                            align={"center"}
                    ></Column>
                    <Column field="employeeName" header="EMPLOYEE"></Column>
                    <Column field="storeName" header="STORE" align={"center"} sortable></Column>
                    <Column field="items.length" header="ITEMS" align={"center"} sortable></Column>
                    <Column field="total"
                            header="TOTAL"
                            sortable
                            dataType={'numeric'}
                            body={currencyBodyTemplate}
                            filter
                            filterField="total"
                            filterElement={totalFilterTemplate}
                    ></Column>
                    <Column field="createdAt"
                            sortable
                            header="CREATED AT"
                            dataType="date"
                            excludeGlobalFilter
                            body={createAtBodyTemplate}
                            filter
                            filterField="createdAt"
                            filterElement={createdAtFilterTemplate}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Sales;