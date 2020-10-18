import React, {useContext, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import {
    SidebarWrapper,
    NavLink,
    MenuWrapper,
    Svg,
} from './Sidebar.style';
import {
    MY_COLLECTIONS, NEW_CARD, COLLECTIONS,
} from 'settings/constants';

import {DashboardIcon} from 'assets/icons/DashboardIcon';
import {ProductIcon} from 'assets/icons/ProductIcon';
import {SidebarCategoryIcon} from 'assets/icons/SidebarCategoryIcon';
import {OrderIcon} from 'assets/icons/OrderIcon';
import {CustomerIcon} from 'assets/icons/CustomerIcon';
import {CouponIcon} from 'assets/icons/CouponIcon';
import {SettingIcon} from 'assets/icons/SettingIcon';
import {AuthContext} from "../../../context/auth";

const sidebarMenusVerified = [
    {
        name: 'Collections',
        path: COLLECTIONS,
        exact: true,
        icon: <DashboardIcon/>,
    },
    {
        name: 'New Collections',
        path: MY_COLLECTIONS,
        exact: false,
        icon: <ProductIcon/>,
    },
    {
        name: 'New Card',
        path: NEW_CARD,
        exact: false,
        icon: <ProductIcon/>,
    },
];

const sidebarMenusDefault = [
    {
        name: 'Collections',
        path: COLLECTIONS,
        exact: true,
        icon: <DashboardIcon/>,
    }
];

export default withRouter(function Sidebar({refs, style, onMenuItemClick}: any) {

    const {address} = useContext(AuthContext);
    const sidebarMenus = useRef([]);

    useEffect(() => {
        sidebarMenus.current = address ? sidebarMenusVerified: sidebarMenusDefault;
    });


    return (
        <SidebarWrapper ref={refs} style={style}>
            <MenuWrapper>
                {sidebarMenus.current.map((menu: any, index: number) => (
                    <NavLink
                        to={menu.path}
                        key={index}
                        exact={menu.exact}
                        activeStyle={{
                            color: '#00C58D',
                            backgroundColor: '#f7f7f7',
                            borderRadius: '50px 0 0 50px',
                        }}
                        onClick={onMenuItemClick}
                    >
                        {menu.icon ? <Svg>{menu.icon}</Svg> : ''}
                        {menu.name}
                    </NavLink>
                ))}
            </MenuWrapper>
        </SidebarWrapper>
    );
});
