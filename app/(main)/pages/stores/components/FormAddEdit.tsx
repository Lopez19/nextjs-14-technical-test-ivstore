'use client'

import {StoreService} from '@/app/(main)/services/StoreService';
import {Button} from 'primereact/button';
import {ColorPicker} from 'primereact/colorpicker';
import {Dropdown} from 'primereact/dropdown';
import {InputMask} from 'primereact/inputmask';
import {InputText} from 'primereact/inputtext';
import {classNames} from 'primereact/utils';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputNumber} from 'primereact/inputnumber';

interface IFormCreate {
    setVisible: ({create: boolean, edit: boolean}) => void;
    setNotify: ({create: boolean,edit: boolean}) => void;
    dataUpdate?: IVStore.Store;
}

const FormAddEdit = ({dataUpdate, setVisible, setNotify}: IFormCreate) => {

    const [departments, setDepartments] = useState([{}]);
    const [cities, setCities] = useState([{}]);
    const id = dataUpdate?.id;
    const isAddMode = !id;

    // Form validation rules
    const validateSchema = Yup.object().shape({
        id: Yup.number(),
        name: Yup.string().required('Name is required'),
        department: Yup.object().required('Department is required'),
        city: Yup.object().required('City is required'),
        street: Yup.string().required('Street is required'),
        phone: Yup.string().required('Phone is required'),
        color: Yup.string().required('Color is required'),
    });

    // Functions to build form returned by useForm() hook
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        setValue,
        getValues,
    } = useForm({
        resolver: yupResolver(validateSchema)
    });

    // On submit form
    const onSubmit = handleSubmit((data) => {
        return isAddMode
            ? createStore(data)
            : updateStore(data);
    });

    // Create Store
    const createStore = (data: any) => {
        StoreService.createStore(data).then((res) => {
            setNotify({
                create: true,
                edit: false
            })
            setVisible({
                create: false,
                edit: false
            })
        })
    };

    // Update Store
    const updateStore = (data: any) => {
        StoreService.updateStore(data).then((res) => {
            setNotify({
                create: false,
                edit: true
            })
            setVisible({
                create: false,
                edit: false
            })
        });
    };

    const [store, setStore] = useState({});

    useEffect(() => {
        StoreService.getAllDepartments().then((res) => {
            setDepartments(res);
        });

        if (!isAddMode) {
            StoreService.getStoreById(id).then(async (res) => {
                const fields = ['id', 'name', 'department', 'city', 'street', 'phone', 'color'];
                fields.forEach((field) => {
                    if (field === 'department') {
                        findDepartmentByName(res.address.department);
                    } else if (field === 'city') {
                        findCityByName(res.address.department, res.address.city);
                    } else if (field === 'street') {
                        setValue(field, res.address.street || '');
                    } else {
                        setValue(field, res[field] || '');
                    }
                })
                setStore(res);
            });
        }
    }, []);

    const findDepartmentByName = async (name: string) => {
        return await StoreService.getAllDepartments().then((res) => {
            const department = res.find((department: any) => department.name === name);
            setValue('department', department || '');
            return department;
        });
    };

    const findCityByName = async (nameDepartment: string, nameCity: string) => {
        const department = await findDepartmentByName(nameDepartment);
        await StoreService.getAllCitiesByDepartmentId(department.id).then((res) => {
            setCities(res)
            const city = res.find((city: any) => city.name === nameCity);
            setValue('city', city || '');
        });
    };

    const getFormErrorMessage = (name: string) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <>
            <form onSubmit={onSubmit} className={"p-fluid mt-5"}>
                <div className="fomrgrid grid mb-3">
                    <div className="field">
                        <Controller name={"id"}
                                    control={control}
                                    render={({field}) => (
                                        <InputNumber id={"id"}
                                                     {...field}
                                                     type={"hidden"}
                                        />
                                    )}
                        />
                    </div>
                    <div className="field col-12">
                        <Controller name={"name"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <span className="p-float-label">
                                            <InputText id={field.name}
                                                       {...field}
                                                       autoComplete={"off"}
                                                       autoFocus
                                                       className={fieldState.error ? 'p-invalid' : ''}
                                            />
                                            <label htmlFor={"name"}>Store Name</label>
                                        </span>
                                    )}
                        />
                        {getFormErrorMessage('name')}
                    </div>
                    <div className="field col-12 lg:col-6">
                        <Controller name={"department"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <span className="p-float-label">
                                            <Dropdown id={"department"}
                                                      {...field}
                                                      optionLabel={"name"}
                                                      placeholder={"Select a Department"}
                                                      options={departments}
                                                      filter
                                                      onChange={(e) => {
                                                          StoreService.getAllCitiesByDepartmentId(e.value.id).then((res) => {
                                                              setCities(res)
                                                          });
                                                          field.onChange(e.value)
                                                      }}
                                                      className={classNames({'p-invalid': fieldState.error})}
                                            />
                                            <label htmlFor={"department"}>Department</label>
                                        </span>
                                    )}
                        />
                        {getFormErrorMessage('department')}
                    </div>
                    <div className="field col-12 lg:col-6">
                        <Controller name={"city"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <span className="p-float-label">
                                            <Dropdown id={"city"}
                                                      {...field}
                                                      filter
                                                      optionLabel={"name"}
                                                      placeholder={"Select a City"}
                                                      options={cities}
                                                      className={classNames({'p-invalid': fieldState.error})}
                                            />
                                            <label htmlFor={"city"}>City</label>
                                        </span>
                                    )}
                        />
                        {getFormErrorMessage('city')}
                    </div>
                    <div className="field col-12 lg:col-6">
                        <Controller name={"street"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <span className="p-float-label">
                                            <InputText id={"street"}
                                                       {...field}
                                                       autoComplete={"off"}
                                                       className={fieldState.error ? 'p-invalid' : ''}
                                            />
                                            <label htmlFor={"street"}>Street Name</label>
                                        </span>
                                    )}
                        />
                        {getFormErrorMessage('street')}
                    </div>
                    <div className="field col-12 lg:col-4">
                        <Controller name={"phone"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <span className="p-float-label">
                                            <InputMask id={"phone"}
                                                       {...field}
                                                       mask={"(+57) 999-999-9999"}
                                                       placeholder={"(+57) 999-999-9999"}
                                                       autoComplete={"off"}
                                                       className={fieldState.error ? 'p-invalid' : ''}
                                            />
                                            <label htmlFor={"phone"}>Phone</label>
                                        </span>
                                    )}
                        />
                        {getFormErrorMessage('phone')}
                    </div>
                    <div className="field col-12 lg:col-2">
                        <Controller name={"color"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <ColorPicker id={"color"}
                                                     {...field}
                                                     placeholder={field.value}
                                                     className={classNames({
                                                         'p-invalid': fieldState.error,
                                                         'w-full': true,
                                                     })}
                                        />
                                    )}
                        />
                        {getFormErrorMessage('color')}
                    </div>
                </div>
                <Button formNoValidate
                        type={"submit"}
                        label={isAddMode ? 'Create Store' : 'Update Store'}
                        className={isAddMode ? 'p-button-success' : 'p-button-warning'}
                        disabled={isSubmitting}
                />
            </form>
        </>
    );

};

export default FormAddEdit;