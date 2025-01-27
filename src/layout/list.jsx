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
                            color: location.pathname === '/dashboard' ? '#fff' : '',
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
            <NavLink to={'/category'}>
                <ListItemButton sx={{
                    backgroundColor: location.pathname === '/category' ? '#DD781E' : 'inherit',
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
                            color: location.pathname === '/category' ? '#fff' : '',

                        }} />
                    </ListItemIcon>
                    <ListItemText primary="Category" />
                </ListItemButton>
            </NavLink>
            <NavLink to={'/enquiry'}>
                <ListItemButton sx={{
                    backgroundColor: location.pathname === '/enquiry' ? '#DD781E' : 'inherit',
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
                            color: location.pathname === '/enquiry' ? '#fff' : '',

                        }} />
                    </ListItemIcon>
                    <ListItemText primary="Enquiry" />
                </ListItemButton>
            </NavLink>

            <NavLink to={'/quotation'}>
                <ListItemButton sx={{
                    backgroundColor: location.pathname === '/quotation' ? '#DD781E' : 'inherit',
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
                            color: location.pathname === '/quotation' ? '#fff' : '',

                        }} />
                    </ListItemIcon>
                    <ListItemText primary="Quotation" />
                </ListItemButton>
            </NavLink>

        </React.Fragment>
    )
};
