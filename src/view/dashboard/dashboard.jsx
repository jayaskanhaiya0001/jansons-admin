import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { ProductionQuantityLimitsSharp } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const getToken = localStorage.getItem('token');

const Dashboard = () => {

  const [productData, setProductData] = useState();
  const [quoteData, setQuoteData] = useState();
  const [contactUsData, setcontactUsData] = useState();
  const [categoryData, setcategoryData] = useState();

  const [isContentVisible, setIsContentVisible] = useState('');

  const setVisibleContent = (st) =>{
    console.log('st: ', st);
    setIsContentVisible(st);
  }

  // Fetch data from API
  useEffect( () => {

    const fetchData = async () => {
      const getData = async (url) => {
        const getToken = localStorage.getItem('token');
        console.log('The token is: ', getToken);
  
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
      };
  
      const tempData1 = await getData('https://jainsons-pvt.vercel.app/api/product/getAll');
      const tempData2 = await getData('https://jainsons-pvt.vercel.app/api/quotes/getAll');
      const tempData3 = await getData('https://jainsons-pvt.vercel.app/api/contactUs/showAll');
      const tempData4 = await getData('https://jainsons-pvt.vercel.app/api/categories/showAll');
  
      setProductData(tempData1);
      setQuoteData(tempData2);
      setcontactUsData(tempData3);
      setcategoryData(tempData4);
    };
  
    fetchData(); // Call the async function
  }, []); 

  const forgetThese = ['_id', 'img', 'imageURLs', '__v']
  // const spaceThese = ['updatedat', 'createdat']

  const renderTable = (data) => {
    // console.log('data: ', data.map());
    return (
      // <span>sfs</span>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(data[0] || {}).map((key, index) => {
                return !forgetThese.includes(key)? 
                  <TableCell key={index}>
                    
                    {key == 'createdAt' ? 'CREATED AT' : key == 'updatedAt' ? 'UPDATED AT' : key.toUpperCase()}
                  </TableCell>
                : null
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {/* {console.log(Object?.values(item))} */}
                {Object.entries(item || {}).map(([key, value], idx) => 
                  // Only render cells if the key is not in the 'forgetThese' array
                  !forgetThese.includes(key) ? (
                    <TableCell key={idx}>
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </TableCell>
                  ) : null
                )}

                {/* {Object?.values(item)?.map((value, idx) => 
                
                  <TableCell key={idx}>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </TableCell>
                )} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Products</Typography>
            {/* <Typography variant="h4" color="primary">{productData?.length}</Typography> */}
            <Typography variant="h4" color="primary">
              <span onClick={ () => setVisibleContent('products')}>{productData?.length}</span>
              
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Categories</Typography>
            {/* <Typography variant="h4" color="secondary">{categoryData?.length}</Typography> */}
            <Typography variant="h4" color="secondary">
              <span onClick={ () => setVisibleContent('categories')}>{categoryData?.length}</span>
              
              </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">New Contacts</Typography>
            {/* <Typography variant="h4" color="tertiary">{contactUsData?.length}</Typography> */}
            <Typography variant="h4" color="tertiary">
              <span onClick={ () => setVisibleContent('contacts')}>{contactUsData?.length}</span>
              
              
              </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">New Quotes</Typography>
            {/* <Typography variant="h4" color="error">{quoteData?.length}</Typography> */}
            <Typography variant="h4" color="error">
              <span onClick={ () => setVisibleContent('quotes')}>{quoteData?.length}</span>
              
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {isContentVisible && isContentVisible === 'products' && renderTable(productData)}
      {isContentVisible && isContentVisible === 'categories' && renderTable(categoryData)}
      {isContentVisible && isContentVisible === 'contacts' && renderTable(contactUsData)}
      {isContentVisible && isContentVisible === 'quotes' && renderTable(quoteData)}

    </Box>
  );
};

export default Dashboard;