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

const FormCreate = () => {
    const [departments, setDepartments] = useState([{}])
    const [cities, setCities] = useState([{}])

    useEffect(() => {
        StoreService.getAllDepartments().then((res) => {
            setDepartments(res)
        })
    }, []);

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        StoreService.createStore(data).then((res) => {
            console.log(res)
        })
        reset()
    });

    const getFormErrorMessage = (name: string) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    }

    return (
        <>
            <form onSubmit={onSubmit} className={"p-fluid mt-5"}>
                <div className="fomrgrid grid mb-3">
                    <div className="field col-12">
                        <Controller name={"name"}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <span className="p-float-label">
                                            <InputText id={"name"}
                                                       {...field}
                                                       autoComplete={"off"}
                                                       autoFocus
                                                       className={fieldState.error ? 'p-invalid' : ''}
                                            />
                                            <label htmlFor={"name"}>Store Name</label>
                                        </span>
                                    )}
                                    rules={{required: 'Name is required'}}
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
                                    rules={{required: 'Department is required'}}
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
                                    rules={{required: 'City is required'}}
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
                                    rules={{required: 'Street is required'}}
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
                                    rules={{required: 'Phone is required'}}
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
                                    rules={{required: 'Color is required'}}
                        />
                        {getFormErrorMessage('color')}
                    </div>
                </div>
                <Button label="Crear" icon={"pi pi-check"} type={"submit"}/>
            </form>
        </>
    );

};

export default FormCreate;