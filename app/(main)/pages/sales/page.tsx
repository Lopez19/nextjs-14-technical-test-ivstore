'use client';

import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {SalesService} from '../../services/SalesService';
import {FilterMatchMode} from 'primereact/api';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Sales = () => {

    const [data, setData] = useState([{}]);
    const [filters, setFilters] = useState({
        global: {value: "", matchMode: FilterMatchMode.CONTAINS},
    });

    useEffect(() => {
        SalesService.getAllSales().then((res) => {
            setData(res)
        })
    }, [])

    const dateTemplate = (rowData: { createdAt: string | number | Date; }) => {
        return (
            <span>{new Date(rowData.createdAt).toLocaleDateString()}</span>
        );
    };

    const currencyTemplate = (rowData: { total: number; }) => {
        return (
            <span>{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(rowData.total)}</span>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={() => {}} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />

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
                    className={`p-datatable-gridlines p-datatable-md`}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    emptyMessage="No sales found..."
                    filterDisplay="menu"
                >
                    <Column field="id" header="ID"></Column>
                    <Column field="employeeName" header="EMPLOYEE" filter></Column>
                    <Column field="storeName" header="STORE" sortable></Column>
                    <Column field="items.length" header="ITEMS" sortable></Column>
                    <Column field="total"
                            header="TOTAL"
                            sortable
                            dataType={'currency'}
                            body={currencyTemplate}
                    ></Column>
                    <Column field="createdAt"
                            header="DATE"
                            sortable
                            dataType={'date'}
                            body={dateTemplate}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Sales;