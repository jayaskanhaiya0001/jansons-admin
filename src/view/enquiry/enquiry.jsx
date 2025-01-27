import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from "xlsx";
import { GetApp as GetAppIcon } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import axios from 'axios';
const forgetThese = ['_id', 'img', 'imageURLs', '__v']
const Enquiry = () => {
    const [categoryData, setcategoryData] = useState();
    const [contactUsData, setcontactUsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const transformData = (data) => {
        return data
            .map(item => `${item.key}: ${item.value}`) // Create key-value pairs
            .join(', '); // Join them with commas
    };

    const getCategory = (catId) => {
        if (categoryData) {
            const catF = categoryData?.find((cat) =>
                cat._id == catId
            )
            return catF.name;
        }
        return null;
    }
    // Fetch data from API
    useEffect(() => {

        const fetchData = async () => {
            const getData = async (url) => {
                const getToken = localStorage.getItem('token');
                //console.log('The token is: ', getToken);
                setLoading(true)
                try {
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${getToken}`, // Add the token to the Authorization header
                        },
                    });

                    return response.data.data;
                } catch (error) {
                    console.error('Error fetching data from:', url, error);
                    return null; // Return null or handle the error properly
                }
                finally {
                    setLoading(false);
                }
            };

            // const tempData1 = await getData('https://jainsons-pvt.vercel.app/api/product/getAll');
            const tempData4 = await getData('https://jainsons-pvt.vercel.app/api/categories/showAll');
            // setProductData(tempData1);
            setcategoryData(tempData4);
        };

        fetchData(); // Call the async function
    }, []);

    useEffect(() => {
        const getData = async (url) => {
            const getToken = localStorage.getItem('token');
            try {
                const response = await axios.get('https://jainsons-pvt.vercel.app/api/contactUs/showAll', {
                    headers: {
                        Authorization: `Bearer ${getToken}`, // Add the token to the Authorization header
                    },
                });
                console.log(response?.data, 'Response Dat')
                if (response?.data?.contacts) {

                    setcontactUsData(response?.data?.contacts)
                }
                // return response.data.data;
            } catch (error) {
                console.error('Error fetching data from:', url, error);
                return null; // Return null or handle the error properly
            }
        };
        getData()
    }, [])

    const exportToExcel = () => {
        // Convert array of objects to worksheet
        const worksheet = XLSX.utils.json_to_sheet([]);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the workbook and trigger download
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "data.xlsx");
    };

    console.log(contactUsData, 'contactUsData')
    return (
        // <span>sfs</span>
        <Box px={4} sx={{ mt: 4, mb: 2 }}>
            <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                <Typography variant='h4' mb={3}>Enquiry</Typography>
                <IconButton color="primary" onClick={exportToExcel}>
                    <GetAppIcon />
                </IconButton>
            </Box>
            {
                loading ? <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="70vh"
                > <CircularProgress size={48} /> </Box> : <TableContainer component={Paper} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(contactUsData[0] || {})?.map((key, index) => {
                                    return !forgetThese?.includes(key) ?
                                        <TableCell key={index}>

                                            {key == 'createdAt' ? 'CREATED AT' : key == 'updatedAt' ? 'UPDATED AT' : key.toUpperCase()}
                                        </TableCell>
                                        : null
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contactUsData?.map((item, index) => (
                                <TableRow key={index}>

                                    {Object.entries(item || {})?.map(([key, value], idx) =>
                                        // Only render cells if the key is not in the 'forgetThese' array
                                        !forgetThese.includes(key) ? (
                                            <TableCell key={idx}>
                                                {typeof value === 'object' ? transformData(value)
                                                    :
                                                    key !== 'category' ? value ? value : "N/A" : getCategory(value)}
                                            </TableCell>
                                        ) : null
                                    )}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

        </Box>
    );
};

export default Enquiry;