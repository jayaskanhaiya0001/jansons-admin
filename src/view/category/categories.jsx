import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from "xlsx";
import { GetApp as GetAppIcon, } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import axios from 'axios';
const forgetThese = ['_id', 'img', 'imageURLs', '__v']
const Category = () => {
    const [categoryData, setcategoryData] = useState();
    const [loading, setLoading] = useState(false);
    const transformData = (data) => {
        return data
            .map(item => `${item.key}: ${item.value}`) // Create key-value pairs
            .join(', '); // Join them with commas
    };

    const getCategory = (catId) => {
        if (categoryData) {
            const catF = categoryData?.find((cat) =>
                cat?._id == catId
            )
            return catF.name;
        }
        return null;
    }


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

    useEffect(() => {
        const getData = async (url) => {
            setLoading(true);
            const getToken = localStorage.getItem('token');
            try {
                const response = await axios.get('https://jainsons-pvt.vercel.app/api/categories/showAll', {
                    headers: {
                        Authorization: `Bearer ${getToken}`, // Add the token to the Authorization header
                    },
                });

                if (response?.data?.data) {

                    setcategoryData(response?.data?.data)
                }
                // return response.data.data;
            } catch (error) {
                console.error('Error fetching data from:', url, error);
                return null; // Return null or handle the error properly
            } finally {
                setLoading(false);
            }
        };
        getData()
    }, []);
    return (
        // <span>sfs</span>
        <Box px={4} sx={{ mt: 4, mb: 2 }}>
            <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                <Typography variant='h4' mb={3}>Category</Typography>
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
                > <CircularProgress size={48} /> </Box> :

                    <TableContainer component={Paper} >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {categoryData && Object.keys(categoryData[0] || {})?.map((key, index) => {
                                        return !forgetThese?.includes(key) ?
                                            <TableCell key={index}>

                                                {key == 'createdAt' ? 'CREATED AT' : key == 'updatedAt' ? 'UPDATED AT' : key.toUpperCase()}
                                            </TableCell>
                                            : null
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categoryData?.map((item, index) => (
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

export default Category;