import React, { useEffect, useRef, useState } from 'react';
import { Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from "xlsx";
import { GetApp as GetAppIcon, } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import axios from 'axios';
const forgetThese = ['_id', 'img', 'imageURLs', '__v']
const Quotation = () => {
    const [quoteData, setQuoteData] = useState();
    
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [dateFilterChange, setDateFilterChange] = useState();

    const [categoryData, setcategoryData] = useState();
    const [loading, setLoading] = useState(false);

    const tableRef = useRef(null);
    
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
            return catF?.name;
        }
        return null;
    }


    const exportToExcel = () => {
        // Get the table element using the ref
        const table = tableRef.current;

        // Extract headers from the table
        const headers = Array.from(table.querySelectorAll("thead th")).map(
            (th) => th.innerText
        );

        // Extract rows from the table
        const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
            Array.from(tr.querySelectorAll("td")).map((td) => td.innerText)
        );

        // Combine headers and rows into an array of objects
        const data = rows.map((row) => {
            return headers.reduce((obj, header, index) => {
                obj[header] = row[index];
                return obj;
            }, {});
        });

        console.log('data: ', data);

        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the workbook to a file and trigger download
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "table_data.xlsx");
    };

    useEffect(() => {
        const getData = async (url) => {
            setLoading(true);
            const getToken = localStorage.getItem('token');

            const paramsFilter = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}`: '';

            try {
                const response = await axios.get(`https://jainsons-pvt.vercel.app/api/quotes/getAll${paramsFilter}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`, // Add the token to the Authorization header
                    },
                });

                const response1 = await axios.get('https://jainsons-pvt.vercel.app/api/categories/showAll', {
                    headers: {
                        Authorization: `Bearer ${getToken}`, // Add the token to the Authorization header
                    },
                });

                if (response1?.data?.data) {
                    setcategoryData(response1?.data?.data)
                }
                console.log(response , 'response ')
                if (response?.data?.data) {
                    setQuoteData(response?.data?.data)
                }
                
                // return response.data.data;
            } catch (error) {
                console.error('Error fetching data from:', url, error);
                return null; // Return null or handle the error properly
            } finally {
                setLoading(false);
            }
        };
        
        getData();
        
        if(dateFilterChange){
            setDateFilterChange(false);
        }
    }, [dateFilterChange]);

    const onStartDateChange = (ev) =>{
        console.log('st: ', ev.target.value);
        setStartDate(ev.target.value);
        if(endDate){
            setDateFilterChange(true);
        }
    }

    const onEndDateChange = (ev) =>{
        console.log('st: ', ev.target.value);
        setEndDate(ev.target.value);
        if(startDate){
            setDateFilterChange(true);
        }
    }

    // console.log(quoteData , 'quoteData')
    return (
        // <span>sfs</span>
        <Box px={4} sx={{ mt: 4, mb: 2 }}>
            <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                <Typography variant='h4' mb={3}>Quotation</Typography>

                <div className="date-container">
                    <input type="date" name="startDate" id="startDate" onChange={onStartDateChange} className='date-input'/>
                    <input type="date" name="endDate" id="endDate" onChange={onEndDateChange} className='date-input'/>
                </div>

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
                        <Table ref={tableRef}>
                            <TableHead>
                                <TableRow>
                                    {quoteData && Object.keys(quoteData[0] || {})?.map((key, index) => {
                                        return !forgetThese?.includes(key) ?
                                            <TableCell key={index}>

                                                {key == 'createdAt' ? 'CREATED AT' : key == 'updatedAt' ? 'UPDATED AT' : key.toUpperCase()}
                                            </TableCell>
                                            : null
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {quoteData?.map((item, index) => (
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

export default Quotation;