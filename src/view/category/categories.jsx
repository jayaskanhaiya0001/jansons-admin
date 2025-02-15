import React, { useEffect, useRef, useState } from 'react';
import { Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from "xlsx";
import { GetApp as GetAppIcon, } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';
const forgetThese = ['_id', 'img', 'imageURLs', '__v']
const Category = () => {
    const [categoryData, setcategoryData] = useState();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token')
    const tableRef = useRef(null);

    const [search, setSearch] = useState('');
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

    const getData = async (url) => {
        setLoading(true);
        const getToken = localStorage.getItem('token');
        try {
            const response = await axios.get('http://jainson-backend.ap-south-1.elasticbeanstalk.com/api/categories/showAll', {
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
    useEffect(() => {
        getData()
    }, []);

    const handleDeleteCategory = async (id) => {
        try {
            const response = await axios.delete("http://jainson-backend.ap-south-1.elasticbeanstalk.com/api/categories/delete",
                {
                    data: {
                        id: id
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }


            );
            if (response.status === 200) {
                toast.success('Category deleted successfully!', {
                    position: 'top-center',
                    autoClose: 3000, // Closes after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                getData()
            } else {
                //   setErrorMsg("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // setErrorMsg("Error logging in. Please check your credentials.");
        } finally {
            // setLoading(false);
        }

    };
    return (
        // <span>sfs</span>
        <Box px={4} sx={{ mt: 4, mb: 2 }}>
            <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                <Typography variant='h4' mb={3}>Category</Typography>
                <input type="text" name="search-box" id="search-box" placeholder='Search Category...'  onChange={(ev) => setSearch(ev.target.value)} style={{
                    width: "100%", // Full width
                    maxWidth: "300px", // Limit width
                    padding: "10px 15px", // Comfortable padding
                    fontSize: "16px", // Readable text
                    border: "2px solid #ccc", // Soft border
                    borderRadius: "8px", // Rounded corners
                    outline: "none", // Remove default outline
                    transition: "border-color 0.3s ease-in-out",
                    height: "max-content"
                }}
                />
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

                    <>

                        <TableContainer component={Paper} >
                            <Table ref={tableRef}>
                                <TableHead>
                                    <TableRow>
                                        {categoryData && Object.keys(categoryData[0] || {})?.map((key, index) => {
                                            return !forgetThese?.includes(key) ?
                                                <TableCell key={index}>

                                                    {key == 'createdAt' ? 'CREATED AT' : key == 'updatedAt' ? 'UPDATED AT' : key.toUpperCase()}
                                                </TableCell>
                                                : null
                                        })}
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryData?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item, index) => (
                                        <>

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

                                                <TableCell>
                                                    <IconButton onClick={() => handleDeleteCategory(item?._id)} color="secondary">
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </>

                                    ))}


                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
            }
        </Box>
    );
};

export default Category;