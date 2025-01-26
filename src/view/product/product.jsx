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
    InputLabel
} from "@mui/material";

import { Delete, Edit } from '@mui/icons-material';
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
// import { InputAsterisk } from "../../component/label/InputLabels";
const CustomButton = styled(Button)(({ theme }) => ({
    padding: '8px 16px !important',
    height: "max-content"
}));
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

    const { handleSubmit, control, reset, setValue, watch } = useForm({
        defaultValues: {
            newCategory: "",
            name: "",
            category: "",
            photos: [],
            features: [{
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
            ]
        }
    });

    const images = watch("photos");
    const newCategory = watch("newCategory");
    // Function to handle image selection
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Generate URLs and store them
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };
        Promise.all(selectedFiles.map(file => convertToBase64(file)))
            .then(base64Images => {
                setValue("photos", [...images, ...base64Images]);
            })
            .catch(error => console.error('Error converting images:', error));

    };


    // Function to remove an image from the list
    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setValue("photos", updatedImages);
    };


    const getAllProduct = async () => {
        try {
            const response = await axios.get("https://jainsons-pvt.vercel.app/api/product/getAll", {
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
            // setLoading(false);
        }
    }

    useEffect(() => {
        getAllProduct()
    }, []);

    const onSubmit = async (data) => {
        const formData = new FormData();

        // formData.append("newCategory", defaultValues.newCategory);
        formData.append("name", data.name);
        formData.append("category", data.category);

        // Append image files
        if (data.photos.length > 0) {
            data.photos.forEach((file, index) => {
                formData.append(`photos[${index}]`, file);
            });
        }

        // Append features
        data.features.forEach((feature, index) => {
            formData.append(`features[${index}][key]`, feature.key);
            formData.append(`features[${index}][value]`, feature.value);
        });

        // Example API call using axios
        await axios.post('https://jainsons-pvt.vercel.app/api/product/add', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                getAllProduct()
            })
            .catch(error => console.error('Error:', error));

    };




    const getAllCategory = async () => {
        try {
            const response = await axios.get("https://jainsons-pvt.vercel.app/api/categories/showAll", {
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
            const response = await axios.post("https://jainsons-pvt.vercel.app/api/categories/add", { name: newCategory }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
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

    const features = watch("features");

    // Function to update a feature's value by index
    const updateFeature = (index, newValue) => {
        const updatedFeatures = [...features];
        updatedFeatures[index].value = newValue;
        setValue("features", updatedFeatures);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete("https://jainsons-pvt.vercel.app/api/product/delete", {
                id: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',


                }
            });

            if (response.data) {
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
        Object.keys(product).forEach(key => setValue(key, product[key]));
    };

    useEffect(() => {
        getAllCategory()
    }, [])

    return (
        <div style={{ height: "100%" }}>
            <Box display={'flex'} flex={1} justifyContent={'space-between'} mb={4} pt={4} px={4}>
                <Typography component={'h1'} fontSize={'26px'}>
                    Product List
                </Typography>
                <Button variant="contained" onClick={() => setDrawerOpen(true)}>
                    Add Product
                </Button>
            </Box>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{

            }}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "40px 20px", width: "600px", marginTop: "40px", }}>
                    <Box sx={{ display: "flex", gap: 2, marginBottom: 2, mt: 2, alignItems: "flex-end" }}>
                        <Controller
                            name="newCategory"
                            control={control}
                            render={({ field }) => (
                                <Box flex={1}>
                                    <InputLabel>Add new category</InputLabel>
                                    {/* <InputAsterisk label="Add new category" htmlFor="" /> */}
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
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
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <InputLabel>Title</InputLabel>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="text"
                                    fullWidth
                                    margin="normal"
                                    required
                                    size="small"
                                />
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <InputLabel>Product Image</InputLabel>
                        <Controller
                            name="photos"
                            control={control}
                            render={() => (
                                <TextField
                                    type="file"
                                    variant="outlined"
                                    onChange={handleImageChange}
                                    margin="normal"
                                    inputProps={{
                                        accept: "image/*", // Limit file selection to images
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            )}
                        />
                    </Box>
                    <Box mt={2}>
                        {images && images?.length > 0 && images?.map((img, index) => (
                            <Box key={index} display="flex" alignItems="center" gap={2} mb={1}>
                                {console.log(img, 'IMG')}
                                <img src={img} height={'100px'} width={'100px'} />
                                <IconButton color="error" onClick={() => removeImage(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    {/* <Box mb={2}>
                        <InputLabel>Description</InputLabel>
                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}

                                    type="text"
                                    fullWidth
                                    margin="normal"
                                    required
                                    rows={4} // 
                                    multiline
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            maxHeight: 'max-content !important',
                                            height: "auto !important"
                                        },

                                    }}
                                />
                            )}
                        />
                    </Box> */}
                    <Box>

                        {features.map((feature, index) => (
                            <Controller
                                key={index}
                                name={`features[${index}].value`}
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <InputLabel>{features[index].key}</InputLabel>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            margin="normal"
                                            value={feature.value}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                        />
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
            <Grid container spacing={3} px={4}>
                {productData.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} >
                        <Card>
                            {console.log(product, 'product')}
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
                                    <IconButton onClick={() => { handleEdit(index); setDrawerOpen(true) }} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product?._id)} color="secondary">
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Product;
