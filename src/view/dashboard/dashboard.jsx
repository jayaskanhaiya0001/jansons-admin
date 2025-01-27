import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Bar } from 'react-chartjs-2';
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
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate()
  const setVisibleContent = (st) => {
    //console.log('st: ', st);
    setIsContentVisible(st);
  }

  // Fetch data from API
  useEffect(() => {

    const fetchData = async () => {
      const getData = async (url) => {
        const getToken = localStorage.getItem('token');
        //console.log('The token is: ', getToken);

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

    fetchData();
  }, []);

  const productData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Products Sold',
        data: [150, 200, 180, 220, 300, 250],
        backgroundColor: '#1976d2',
      },
    ],
  };

  const inquiryData = {
    labels: ['Pending', 'Resolved', 'Archived'],
    datasets: [
      {
        label: 'Inquiries',
        data: [20, 45, 10],
        backgroundColor: ['#ff9800', '#4caf50', '#9e9e9e'],
      },
    ],
  };

  // const forgetThese = ['_id', 'img', 'imageURLs', '__v']

  // const getCategory = (catId) => {
  //   if (categoryData) {
  //     const catF = categoryData.find((cat) =>
  //       cat._id == catId
  //     )
  //     return catF.name;
  //   }
  //   return null;
  // }

  // const transformData = (data) => {
  //   return data
  //     .map(item => `${item.key}: ${item.value}`) // Create key-value pairs
  //     .join(', '); // Join them with commas
  // };

  // const renderTable = (data) => {
  //   // //console.log('data: ', data.map());
  //   return (
  //     // <span>sfs</span>
  //     <TableContainer component={Paper} sx={{ mt: 4 }}>
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             {Object.keys(data[0] || {})?.map((key, index) => {
  //               return !forgetThese?.includes(key) ?
  //                 <TableCell key={index}>

  //                   {key == 'createdAt' ? 'CREATED AT' : key == 'updatedAt' ? 'UPDATED AT' : key.toUpperCase()}
  //                 </TableCell>
  //                 : null
  //             })}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {data?.map((item, index) => (
  //             <TableRow key={index}>

  //               {Object.entries(item || {})?.map(([key, value], idx) =>
  //                 // Only render cells if the key is not in the 'forgetThese' array
  //                 !forgetThese.includes(key) ? (
  //                   <TableCell key={idx}>
  //                     {typeof value === 'object' ? transformData(value)
  //                       :
  //                       key !== 'category' ? value : getCategory(value)}
  //                   </TableCell>
  //                 ) : null
  //               )}

  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   );
  // };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Product Performance</Typography>
            <Bar data={productData1} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Inquiry Status</Typography>
            <Bar data={inquiryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} onClick={() => navigate('/product')}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} onClick={() =>productData?.length > 0 && setVisibleContent('products')}>
            <Typography variant="h6">Total Products</Typography>
            {/* <Typography variant="h4" color="primary">{productData?.length}</Typography> */}
            <Typography variant="h4" color="primary">
              <span >{productData?.length || 0}</span>

            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} onClick={() => navigate('/category')}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} onClick={() =>  categoryData?.length > 0 &&  setVisibleContent('categories')}>
            <Typography variant="h6">Total Categories</Typography>
            {/* <Typography variant="h4" color="secondary">{categoryData?.length}</Typography> */}
            <Typography variant="h4" color="secondary">
              <span >{categoryData?.length || 0}</span>

            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} onClick={() => navigate('/enquiry')}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} onClick={() => contactUsData?.length > 0 && setVisibleContent('contacts')}>
            <Typography variant="h6">New Contacts</Typography>
            {/* <Typography variant="h4" color="tertiary">{contactUsData?.length}</Typography> */}
            <Typography variant="h4" color="tertiary">
              <span >{contactUsData?.length || 0}</span>


            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} onClick={() => navigate('/quotation')}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }} onClick={() => quoteData?.length > 0 && setVisibleContent('quotes')} >
            <Typography variant="h6">New Quotes</Typography>
            {/* <Typography variant="h4" color="error">{quoteData?.length}</Typography> */}
            <Typography variant="h4" color="error">
              <span >{quoteData?.length || 0}</span>

            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;