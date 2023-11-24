'use client';

import React, {useEffect, useState} from 'react';

import {StoreService} from "@/app/(main)/services/StoreService";
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import FormCreate from './components/FormCreate';

const Manager = () => {

    const [stores, setStores] = useState<IVStore.Store[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        StoreService.getAllStores().then((res) => {
            setStores(res);
        });
    }, []);

    const actionBodyTemplate = () => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-mr-2"/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"/>
            </React.Fragment>
        );
    };

    const colorBodyTemplate = (rowData: IVStore.Store) => {
        return (
            <React.Fragment>
                <span className="p-tag" style={{backgroundColor: rowData.color}}>{rowData.color}</span>
            </React.Fragment>
        );
    };

    return (
        <>
            <div className="grid">
                <div className={`col-12 lg:col-6 xl:col-3`}>
                    <Button label="Create Store" outlined icon="pi pi-external-link" onClick={() => setVisible(true)}/>
                </div>
                <div className={`col-12`}>
                    <DataTable
                        value={stores}
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{minWidth: '50rem'}}
                    >
                        <Column field="name" header="Name" sortable={true}></Column>
                        <Column field="address.department" header="Department" sortable={true}></Column>
                        <Column field="address.city" header="City" sortable={true}></Column>
                        <Column field="address.street" header="Street" sortable={true}></Column>
                        <Column field="address.country" header="Country" sortable={true}></Column>
                        <Column field="color" header="Color" sortable={true} body={colorBodyTemplate}></Column>
                        <Column field="phone" header="Phone" sortable={true}></Column>
                        <Column field="createdAt" header="Created At" sortable={true} dataType="date"></Column>
                        <Column header={"Actions"}
                                headerStyle={{width: '5rem', textAlign: 'center'}}
                                bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                                body={actionBodyTemplate}/>
                    </DataTable>
                </div>
            </div>

            <Dialog header="Create Store"
                    visible={visible}
                    style={{width: '50rem', margin: '0 2rem'}}
                    breakpoints={{'960px': '75vw'}}
                    onHide={() => {
                        setVisible(false);
                    }}
                    draggable={false}
            >
                <FormCreate />
            </Dialog>
        </>
    );
};

export default Manager;