import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { NavLink, useLocation } from 'react-router-dom';
export const MainListItems = () => {
    const location = useLocation()
    return (

        <React.Fragment>
            <NavLink to={'/dashboard'}>
                <ListItemButton sx={{
                    backgroundColor: location.pathname === '/dashboard' ? '#DD781E' : 'inherit',
                    '&:hover': {
                        backgroundColor: '#DD781E',
                        color: "#fff"
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#DD781E',
                        color: "#fff",
                        '&:hover': {
                            backgroundColor: '#DD781E',
                            color: "#fff"
                        },
                    },
                }}>
                    <ListItemIcon>
                        <DashboardIcon sx={{
                            color: location.pathname === '/product' ? '#DD781E' : '#fff',
                        }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </NavLink>
            <NavLink to={'/product'}>
                <ListItemButton sx={{
                    backgroundColor: location.pathname === '/product' ? '#DD781E' : 'inherit',
                    '&:hover': {
                        backgroundColor: '#DD781E',
                        color: "#fff"
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#DD781E',
                        color: "#fff",
                        '&:hover': {
                            backgroundColor: '#DD781E',
                            color: "#fff"
                        },
                    },
                }}>
                    <ListItemIcon>
                        <PeopleIcon sx={{
                            color: location.pathname === '/product' ? '#fff' : '',

                        }} />
                    </ListItemIcon>
                    <ListItemText primary="Product" />
                </ListItemButton>
            </NavLink>

        </React.Fragment>
    )
};
