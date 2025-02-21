import { useState, useEffect } from "react";
import {
    Drawer,
    Button,
    TextField,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Box,
    Select,
    MenuItem,
    styled,
    IconButton,
    InputLabel,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import { Delete, Edit, GetApp as GetAppIcon } from '@mui/icons-material';
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';
import { saveAs } from "file-saver";
import axios from "axios";
import { toast } from 'react-toastify';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as XLSX from "xlsx";
import 'react-toastify/dist/ReactToastify.css';
import AppsIcon from '@mui/icons-material/Apps';
import TableChartIcon from '@mui/icons-material/TableChart';

const CustomButton = styled(Button)(({ theme }) => ({
    padding: '8px 16px !important',
    height: "max-content"
}));


const validationSchema = yup.object().shape({
    newCategory: yup
        .string()
        .nullable(),
    name: yup
        .string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must not exceed 50 characters"),
    category: yup
        .string()
        .required("Category is required"),
    photos: yup.mixed().required('Photos is required'),
    features: yup
        .array()
        .of(
            yup.object().shape({
                key: yup.string().required("Key is required"),
                value: yup
                    .string()
                    .required("Value is required")
                    .test(
                        "is-alphanumeric-for-size",
                        "Size must be alphanumeric",
                        function (value) {
                            // Access the "key" field for conditional validation
                            const { key } = this.parent;
                            if (key === "Size") {
                                return true;
                            }
                            return true; // For other keys, no validation on format
                        }
                    )
            })
        )
});

const products = [
    {
        id: 1,
        name: "Classic Wooden Chair",
        material: "Wood",
        brand: "FurniturePro",
        size: "40x40x90 cm",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", // Replace with a real image URL if available
    },
    {
        id: 2,
        name: "Modern Metal Table",
        material: "Metal",
        brand: "MetalWorks",
        size: "120x60x75 cm",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
        id: 3,
        name: "Elegant Sofa",
        material: "Fabric & Wood",
        brand: "ComfortPlus",
        size: "200x90x80 cm",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
        id: 4,
        name: "Stylish Bed Frame",
        material: "Steel & Wood",
        brand: "SleepWell",
        size: "180x200 cm",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
        id: 5,
        name: "Office Desk",
        material: "Engineered Wood",
        brand: "OfficeZone",
        size: "150x75x75 cm",
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
];

const categories = [
    "Cable & Wiring Accessories",
    "Cable Glands (PG & Metric Thread)",
    "Electronic switchgear and motor control",
    "Connectors",
    "Controllers",
    "Electronics housings",
    "Fieldbus components and systems",
    "Flexible Conduit Pipe & Glands",
    "Grounding Systems",
    "HMIs and industrial PCs",
    "I/O systems",
    "Identification Systems/Solutions",
    "Power supplies and UPS",
    "Installation Tools & Mounting Materials",
    "Industrial communication technology",
    "Industrial Enclosure",
    "Lighting and signalling",
    "Safety, Security, Health & Environment Products",
    "PCB terminal blocks and PCB connectors",
    "Surge protection and interference filters",
    "Protective devices",
    "Switches (Rotary / Cam Switch / DC Switch / AC Switch / Changeover)",
    "Test, Measurement, Monitoring and Control Technology",
    "Sensor/actuator cabling",
    "Wire Termination",
];

const Product = () => {
    const token = localStorage.getItem('token')
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [categories, setCategories] = useState([])
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [productId, setProductId] = useState(null);
    const [viewType, setViewType] = useState('Grid');
    const [categoryData, setcategoryData] = useState();
    const [dropDownValue, setDropDownValue] = useState("");
    const { handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            newCategory: "",
            name: "",
            category: "",
            photos: [],
            features: [

                {
                    key: "Description",
                    value: ''
                }, {
                    key: "Material",
                    value: ''
                },
                {
                    key: "Brand",
                    value: ''
                },
                {
                    key: "Size",
                    value: ''
                },

                {
                    key: "Part No.",
                    value: ''
                },
                {
                    key: "Stock Movement",
                    value: ''
                },

            ]
        },
        resolver: yupResolver(validationSchema)
    });
    const [searchText, setSearchText] = useState("");
    const [selectdropDownValue, setSelectDropDownValue] = useState("");
    const images = watch("photos");
    const newCategory = watch("newCategory");
    const [allImages, setAllImages] = useState([]);
    const [removeImages , setRemoveImages] = useState([])
    // Function to handle image selection
    const handleImageChange = (e) => {
        // const selectedFiles = Array.from(e.target.files);

        const selectedFiles = Array.from(e.target.files);
        setValue("photos", selectedFiles);


    };

    // Function to remove an image from the list
    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setValue("photos", updatedImages);
    };

    const getData = async (url) => {
        setLoading(true);
        const getToken = localStorage.getItem('token');
        try {
            const response = await axios.get('https://api.jainsonsindiaonline.com/api/categories/showAll', {
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


    const getAllProduct = async () => {
        setLoading(true)
        try {
            const response = await axios.get("https://api.jainsonsindiaonline.com/api/product/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setProductData(response.data?.data)
            } else {
                //   setErrorMsg("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // setErrorMsg("Error logging in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllProduct()
        getData()
    }, []);

    const onSubmit = async (data) => {
        const formData = new FormData();

        // formData.append("newCategory", defaultValues.newCategory);


        // Append image files
        if (data.photos.length > 0) {
            data.photos.forEach((file, index) => {
                formData.append('photos', file);
            });
        }

        if (isUpdate) {
            formData.append("id", productId);
            formData.append("newName", data.name);
            data.features.forEach((feature, index) => {
                formData.append(`updatedFeatures[${index}][key]`, feature.key);
                formData.append(`updatedFeatures[${index}][value]`, feature.value);
            });
            if(removeImages) {
                formData.append("toBeRemovedImages", removeImages);  
            }
        } else {
            formData.append("name", data.name);
            formData.append("category", data.category);
            data.features.forEach((feature, index) => {
                formData.append(`features[${index}][key]`, feature.key);
                formData.append(`features[${index}][value]`, feature.value);
            });
        }

        // Append features
        if (isUpdate) {

            await axios.put(`https://api.jainsonsindiaonline.com/api/product/edit`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    toast.success('Product Update successfully!', {
                        position: 'top-center',
                        autoClose: 3000, // Closes after 3 seconds
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    reset()
                    getAllProduct()
                    setDrawerOpen(false)
                })
                .catch(error => console.error('Error:', error));
        } else {

            await axios.post(`https://api.jainsonsindiaonline.com/api/product/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    toast.success('Product Add successfully!', {
                        position: 'top-center',
                        autoClose: 3000, // Closes after 3 seconds
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    reset()
                    getAllProduct()
                    setDrawerOpen(false)
                })
                .catch(error => console.error('Error:', error));
        }

    };
    // Example API call using axios

    const getAllCategory = async () => {
        try {
            const response = await axios.get("https://api.jainsonsindiaonline.com/api/categories/showAll", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setCategories(response.data?.data)
            } else {
                //   setErrorMsg("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // setErrorMsg("Error logging in. Please check your credentials.");
        } finally {
            // setLoading(false);
        }
    }
    const handleAddCategory = async (newCategory) => {
        try {
            const response = await axios.post("https://api.jainsonsindiaonline.com/api/categories/add", { name: newCategory }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {

                getAllCategory()
                toast.success('Category added successfully!', {
                    position: 'top-center',
                    autoClose: 3000, // Closes after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setValue('newCategory', '')
            } else {
                //   setErrorMsg("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // setErrorMsg("Error logging in. Please check your credentials.");
        } finally {
            // setLoading(false);
        }

    };



    const features = watch("features");

    // Function to update a feature's value by index
    const updateFeature = (index, newValue) => {
        const updatedFeatures = [...features];
        updatedFeatures[index].value = newValue;
        setValue("features", updatedFeatures);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete("https://api.jainsonsindiaonline.com/api/product/delete",
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
            console.log(response, 'response 1212')
            if (response.status === 200) {
                toast.success('Product deleted successfully!', {
                    position: 'top-center',
                    autoClose: 3000, // Closes after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                getAllCategory()
            } else {
                //   setErrorMsg("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // setErrorMsg("Error logging in. Please check your credentials.");
        } finally {
            // setLoading(false);
        }

    };
    const handleEdit = (index) => {
        const product = productData[index];
        console.log(productData[index], 'productData[index]')
        Object.keys(product).forEach(key => setValue(key, product[key]));
        setAllImages(productData[index]?.imageURLs)
        setIsUpdate(true)
    };

    const exportToExcel = () => {

        const headers = ["name", "title", "material", "category", "brand", "size", "partNo", "Stock Movement", "createdAt", "updatedAt"]; // Constant headers

        function findFeature(header, features) {
            const feat = features.find((ftr) => header.toLowerCase() == ftr['key'].toLowerCase())
            return feat?.value;
        }

        function findCategory(cat) {
            const des_cat = categories.find((c) => c._id == cat);
            return des_cat?.name;
        }

        console.log('product: ', productData);

        // Combine headers and rows into an array of objects
        const data = productData.map((product) => {
            return headers.reduce((obj, header, index) => {
                if (header == 'name' || header == 'createdAt' || header == 'updatedAt') {
                    obj[header] = product[header] || '';
                }
                else if (header == 'category') {
                    obj['category'] = findCategory(product['category']);
                } else {
                    obj[header] = findFeature(header, product['features']);
                }
                return obj;
            }, {});
        });

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
        getAllCategory()
    }, [])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const DeleteImages = (index) => {
        const deleteImage = allImages?.filter((data, ind) => index !== ind);
        
        setRemoveImages([...removeImages, allImages[index]?.img])
        setAllImages(deleteImage)
    }
    console.log(removeImages , 'removeImages 1212')
    return (
        <div style={{ height: "100%" }}>
            <Box display={'flex'} flex={1} justifyContent={'space-between'} mb={4} pt={4} px={4}>
                <Typography component={'h1'} fontSize={'26px'}>
                    Product List
                </Typography>
                <Box display={'flex'} gap={4} height={'max-content'}>
                    <TextField placeholder="Search by product name" sx={{ height: "max-content" }} onChange={(e) => setSearchText(e.target.value)} />
                    <Select value={dropDownValue}
                        onChange={(event) => { setDropDownValue(event.target.value); setSelectDropDownValue(event.target.value) }}
                        displayEmpty
                    // renderValue={(selected) => (selected ? selected : "Select an option")}
                    >
                        <MenuItem disabled value="">
                            Select an Category
                        </MenuItem>
                        {
                            categoryData?.map((data) => <MenuItem value={data?._id}>
                                {data?.name}
                            </MenuItem>)
                        }

                    </Select>
                </Box>
                <Box display={'flex'} gap={2} alignItems={'center'}>
                    <IconButton onClick={() => setViewType('Table')} color={viewType === "Table" ? "secondary" : ''}>
                        <TableChartIcon />
                    </IconButton>
                    <IconButton onClick={() => setViewType('Grid')} color={viewType === "Grid" ? "secondary" : ''}>
                        <AppsIcon />
                    </IconButton>
                    <div className="">


                        <IconButton color="primary" onClick={exportToExcel}>
                            <GetAppIcon />
                        </IconButton>
                    </div>
                    <Button variant="contained" onClick={() => setDrawerOpen(true)}>
                        Add Product
                    </Button>
                </Box>
            </Box>
            <Drawer anchor="right" open={drawerOpen} onClose={() => { setDrawerOpen(false); setIsUpdate(false); setProductId(null) }} sx={{

            }}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "40px 20px", width: "600px", marginTop: "40px", }}>
                    <Box sx={{ display: "flex", gap: 2, marginBottom: 2, mt: 2, alignItems: " flex-end" }}>
                        <Controller
                            name="newCategory"
                            control={control}
                            render={({ field }) => (
                                <Box flex={1} justifyContent={'space-between'}>
                                    <InputLabel>Add new category</InputLabel>
                                    <TextField
                                        {...field}
                                        value={watch('newCategory') || ''}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            mt: 1
                                        }}
                                    />
                                </Box>
                            )}
                        />
                        <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddCategory(newCategory || '')}
                            sx={{ whiteSpace: "nowrap" }}

                        >
                            Add Category
                        </CustomButton>
                    </Box>
                    <Box mb={2}>

                        <InputLabel>Category</InputLabel>
                        <Controller
                            name="category"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        fullWidth
                                        error={!!fieldState.error}
                                        size="small"
                                        margin="normal"
                                    >
                                        {categories?.map((category, index) => (
                                            <MenuItem key={index} value={category?._id}>
                                                {category?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <p>{fieldState.error?.message}</p>
                                </>
                            )}
                        />

                    </Box>
                    <Box mb={2}>
                        <InputLabel>Title</InputLabel>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <>

                                    <TextField
                                        {...field}
                                        type="text"
                                        fullWidth
                                        margin="normal"
                                        required
                                        size="small"
                                    />
                                    <p>{fieldState.error?.message}</p>
                                </>
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <InputLabel>Product Image</InputLabel>
                        <Controller
                            name="photos"
                            control={control}
                            render={({ fieldState }) => (
                                <>



                                    <TextField
                                        type="file"
                                        variant="outlined"
                                        onChange={handleImageChange}
                                        margin="normal"

                                        inputProps={{
                                            accept: "image/*", // Limit file selection to images
                                            multiple: true
                                        }}
                                        fullWidth
                                        size="small"
                                    />
                                    <p>{fieldState.error?.message}</p>
                                </>
                            )}
                        />
                        {
                            allImages?.map((data , index) => <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}><img src={data?.url} style={{ height: "100px", width: "100px" }} /><IconButton onClick={() => DeleteImages(index)}><DeleteIcon /></IconButton></Box>)
                        }
                    </Box>

                    <Box>

                        {features.map((feature, index) => (
                            <Controller
                                key={index}
                                name={`features[${index}].value`}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        {
                                            features[index].key === 'Stock Movement' ? (
                                                <>
                                                    <InputLabel>{features[index].key}</InputLabel>
                                                    <Box>
                                                        <FormControlLabel control={<Checkbox value={'Fast Moving Stock'} onChange={() => updateFeature(index, 'Fast Moving Stock')} checked={features[index].value === 'Fast Moving Stock'} />} label="Fast Moving Stock (A)" />
                                                        <FormControlLabel control={<Checkbox value={'Slow Moving Stock'} onChange={() => updateFeature(index, 'Slow Moving Stock')} checked={features[index].value === 'Slow Moving Stock'} />} label="Slow Moving Stock (A)" />
                                                    </Box>
                                                    <p>{fieldState.error?.message}</p>
                                                </>
                                            ) : (
                                                <>
                                                    {console.log(features[index].key === 'Description', 'Hello')}
                                                    <InputLabel>{features[index].key}</InputLabel>
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        margin="normal"
                                                        value={feature.value}
                                                        multiline
                                                        onChange={(e) => updateFeature(index, e.target.value)}
                                                        rows={features[index].key === 'Description' ? 4 : ''}
                                                    />
                                                    <p>{fieldState.error?.message}</p>
                                                </>
                                            )
                                        }

                                    </>
                                )}
                            />
                        ))}
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "40px" }}>
                        Submit
                    </Button>
                </form>
            </Drawer>
            {
                loading ? <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="70vh"
                > <CircularProgress size={48} /> </Box> :
                    <>
                        {
                            viewType !== 'Grid' ? (
                                <Box px={3}>
                                    <Paper>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>S.No.</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Category</TableCell>
                                                        <TableCell>Description</TableCell>
                                                        <TableCell>Material</TableCell>
                                                        <TableCell>Brand</TableCell>
                                                        <TableCell>Size</TableCell>
                                                        <TableCell>Part No.</TableCell>
                                                        <TableCell>Stock Movement</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {productData?.filter(product =>
                                                        (selectdropDownValue ? product.category === selectdropDownValue : true) &&
                                                        (searchText ? product.name.toLowerCase().includes(searchText.toLowerCase()) : true)
                                                    )?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                                        <TableRow key={row.id}>

                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row?.category}</TableCell>
                                                            {
                                                                row?.features?.map((data) => <TableCell>{data.value}</TableCell>)
                                                            }
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                                            component="div"
                                            count={productData?.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                </Box>
                            ) :

                                <Box>

                                    <Grid container spacing={3} px={4}>
                                        {productData?.filter(product =>
                                            (selectdropDownValue ? product.category === selectdropDownValue : true) &&
                                            (searchText ? product.name.toLowerCase().includes(searchText.toLowerCase()) : true)
                                        )?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, index) => (
                                            <>
                                                <Grid item xs={12} sm={6} md={4} key={index} >
                                                    <Card>
                                                        {console.log(product, 'Check Product')}
                                                        <CardContent>
                                                            <Typography variant="h6">{product?.name}</Typography>
                                                            <Typography variant="body2">{product?.description}</Typography>
                                                            {
                                                                product?.features?.map((data) => <Typography variant="body2">{data?.key}: {data?.value}</Typography>)
                                                            }
                                                            <Box sx={{ mt: 2 }}>
                                                                {product?.image && <img src={product?.image} alt="product" style={{ maxWidth: '100%' }} />}
                                                            </Box>

                                                            {/* Edit and Delete buttons */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                                <IconButton onClick={() => { handleEdit(index); setDrawerOpen(true); setProductId(product?._id) }} color="primary">
                                                                    <Edit />
                                                                </IconButton>
                                                                <IconButton onClick={() => handleDelete(product?._id)} color="secondary">
                                                                    <Delete />
                                                                </IconButton>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>

                                            </>

                                        ))}

                                    </Grid>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                                        component="div"
                                        count={productData?.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Box>
                        }
                    </>
            }

        </div>
    );
};

export default Product;
