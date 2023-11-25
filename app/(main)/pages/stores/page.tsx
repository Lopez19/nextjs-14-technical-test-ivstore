'use client';

import React, {Fragment, useEffect, useState} from 'react';

import {StoreService} from "@/app/(main)/services/StoreService";
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import toast, {Toaster} from 'react-hot-toast';
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import FormAddEdit from './components/FormAddEdit';

const Manager = () => {

    const [stores, setStores] = useState<IVStore.Store[]>([]);

    const [visible, setVisible] = useState({
        create: false,
        edit: false
    });

    const [notify, setNotify] = useState({
        create: false,
        edit: false
    });
    const [titleDialog, setTitleDialog] = useState('Create Store');
    const [store, setStore] = useState<IVStore.Store>({} as IVStore.Store);

    useEffect(() => {
        if (notify.create) {
            toast.success('Store created successfully!', {
                duration: 5000
            });
            setNotify({
                create: false,
                edit: false
            });
            getAllStores();
        } else  {
            if (notify.edit) {
                toast.success('Store updated successfully!', {
                    duration: 5000
                });
                setNotify({
                    create: false,
                    edit: false
                });
                getAllStores();
            }
        }
    }, [notify]);

    useEffect(() => {
        getAllStores();
    }, []);

    //Obtener todos los stores
    const getAllStores = () => {
        StoreService.getAllStores().then((res) => {
            setStores(getStores(res));
        });
    }

    //Transformando los datos de la API a formato de fecha
    const getStores = (data: any) => {
        return [...(data || [{}])].map((d) => {
            d.createdAt = new Date(d.createdAt);
            return d;
        });
    };

    //Template Body
    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
            weekday: "short",
        });
    };
    const createAtBodyTemplate = (rowData: { createdAt: string | number | Date }) => {
        return formatDate(new Date(rowData.createdAt));
    };

    const colorBodyTemplate = (rowData: IVStore.Store) => {
        return (
            <React.Fragment>
                <span className="p-tag" style={{backgroundColor: rowData.color}}>{rowData.color}</span>
            </React.Fragment>
        );
    };

    const actionsBodyTemplate = (rowData: any) => (
        <Fragment>
            <Button icon="pi pi-pencil"
                    className="p-button-rounded p-button-info mr-2"
                    onClick={() => {
                        setTitleDialog('Edit Store');
                        setVisible({
                            create: false,
                            edit: true
                        });
                        setStore(rowData);
                    }}
            />
            <Button icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => {
                        handleDelete(rowData.id)
                    }}
            />
        </Fragment>
    )

    //Dialog
    const onHide = () => {
        setVisible({
            create: false,
            edit: false
        });
    }

    //Actions
    const handleDelete = (id: number) => {
        confirmDialog({
            message: 'Are you sure you want to delete this store?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteStore(id),
            reject: () => reject()
        });
    }
    const reject = () => {
        toast.error('Rejected', {
            duration: 5000
        });
    }
    const deleteStore = (id: number): void => {
        toast.promise(StoreService.deleteStoreById(id), {
            loading: 'Deleting store...',
            success: 'Store deleted successfully',
            error: 'Error deleting store'
        }).then((res) => {
            res === 200 && getAllStores();
        });
    }


    //Render
    return (
        <>
            <Toaster/>
            <ConfirmDialog/>
            <Dialog header={titleDialog}
                    visible={visible.create || visible.edit}
                    style={{width: '50rem', margin: '0 2rem'}}
                    breakpoints={{'960px': '75vw'}}
                    onHide={onHide}
                    draggable={false}
            >
                <FormAddEdit setVisible={setVisible}
                             setNotify={setNotify}
                             dataUpdate={store}
                />
            </Dialog>

            <div className="grid">
                <div className={`col-12 lg:col-6 xl:col-3`}>
                    <Button label="Create Store"
                            outlined
                            icon="pi pi-external-link"
                            onClick={() => {
                                setTitleDialog('Create Store');
                                setVisible({
                                    create: true,
                                    edit: false
                                });
                                setStore({} as IVStore.Store);
                            }}
                    />
                </div>
                <div className={`card col-12`}>
                    <DataTable
                        value={stores}
                        paginator rows={10}
                        rowsPerPageOptions={[10, 20, 30]}
                        tableStyle={{minWidth: '50rem'}}
                        removableSort={true}
                        showGridlines={true}
                        sortField="createdAt"
                        sortOrder={-1}
                    >
                        <Column field="index"
                                header="#"
                                sortable={false}
                                align={"center"}
                                body={(rowData: any, {rowIndex}) => rowIndex + 1}
                        />
                        <Column field="name" header="Name" sortable={true}/>
                        <Column field="address.department" header="Department" sortable={true}/>
                        <Column field="address.city" header="City" sortable={true}/>
                        <Column field="address.street" header="Street" sortable={true}/>
                        <Column field="address.country"
                                header="Country"
                                sortable={true}
                                align={"center"}
                        />
                        <Column field="color"
                                header="Color"
                                sortable={true}
                                body={colorBodyTemplate}
                                align={"center"}
                        />
                        <Column field="phone" header="Phone" sortable={true} align={"center"}/>
                        <Column field="createdAt"
                                header="Created At"
                                align={"center"}
                                sortable={true}
                                dataType="date"
                                body={createAtBodyTemplate}
                        />
                        <Column field="actions"
                                header="Actions"
                                sortable={false}
                                align={"center"}
                                body={actionsBodyTemplate}
                        />
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default Manager;


