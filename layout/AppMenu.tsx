/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Analytics', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Stores',
            items: [
                { label: 'Manager', icon: 'pi pi-fw pi-shopping-bag', to: '/pages/stores' }
            ]
        },
        {
            label: 'Sales',
            items: [
                { label: 'Sales', icon: 'pi pi-fw pi-dollar', to: '/pages/sales' }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
