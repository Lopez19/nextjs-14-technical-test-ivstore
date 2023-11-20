'use client';

import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {ColorPicker} from "primereact/colorpicker";
import {StoreService} from "@/app/(main)/services/StoreService";

const Manager = () => {

    const [sales, setSales] = useState<IVStore.Store[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        StoreService.getAllStores().then((res) => {
            setSales(res);
        });
    }, []);

    const actionBodyTemplate = (rowData: IVStore.Store) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-mr-2"/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"/>
            </React.Fragment>
        );
    };

    const colorBodyTemplate = (rowData: IVStore.Store) => {
        return (
            <ColorPicker color={rowData.color} disabled={true} onChange={(e) => console.log(e.value)}/>
        );
    };

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text"/>
            <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus type={"submit"}/>
        </div>
    );

    return (
        <div className="grid">
            <div className={`col-12 lg:col-6 xl:col-3`}>
                <Button label="Create Store" outlined icon="pi pi-external-link" onClick={() => setVisible(true)}/>
            </div>

            <Dialog header="Header" visible={visible} style={{width: '50vw'}} onHide={() => setVisible(false)}
                    footer={footerContent}>
                <form>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username"/>
                    </div>

                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">$</span>
                        <InputNumber placeholder="Price"/>
                        <span className="p-inputgroup-addon">.00</span>
                    </div>

                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">www</span>
                        <InputText placeholder="Website"/>
                    </div>
                </form>
            </Dialog>

            <div className={`col-12`}>
                <DataTable
                    value={sales}
                    paginator rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{minWidth: '50rem'}}
                >
                    <Column field="name" header="Name" sortable={true}></Column>
                    <Column field="address.city" header="City" sortable={true}></Column>
                    <Column field="address.street" header="Street" sortable={true}></Column>
                    <Column field="address.country" header="Country" sortable={true}></Column>
                    <Column header="Color" sortable={true} body={colorBodyTemplate}></Column>
                    <Column field="phone" header="Phone" sortable={true}></Column>
                    <Column field="createdAt" header="Created At" sortable={true} dataType="date"></Column>
                    <Column header={"Actions"}
                            headerStyle={{width: '5rem', textAlign: 'center'}}
                            bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                            body={actionBodyTemplate}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default Manager;