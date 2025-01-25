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
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editorData, setEditorData] = useState("");
    // const [products, setProducts] = useState([]);

    const [categoryList, setCategoryList] = useState(categories);
    const [productData, setProductData] = useState([]);
    // Add new category


    const { handleSubmit, control, reset, setValue, watch } = useForm({
        defaultValues: {
            newCategory: "",
            title: "",
            description: "",
            category: "",
            material: "",
            size: "",
            brand: "",
            image: null
        }
    });

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('productData')) || [];
        setProductData(storedData);
    }, []);

    const onSubmit = (data) => {
        const updatedData = [...productData, data];
        setProductData(updatedData);
        localStorage.setItem('productData', JSON.stringify(updatedData));
        reset()
    };

    const [events, setEvents] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // You can store the file in a separate state if needed, or process it
            console.log(file); // Debugging

            // Optionally update the form state with the file's name or a file URL
            setValue('image', file.name); // If you want to store only the file name
        }
    };

    const logEvent = (evt) => {
        evt.timestamp = new Intl.DateTimeFormat('en', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date());

        setEvents(events => [evt, ...events]);
    }

    const clearEvents = () => {
        setEvents([]);
    }

    const newCategory = watch("newCategory");
    const handleAddCategory = (newCategory) => {

        if (newCategory.trim() !== "" && !categoryList.includes(newCategory)) {
            setCategoryList((prev) => [...prev, newCategory]);
            setValue("newCategory", ""); // Reset the input
        } else {
            alert("Category already exists or is empty!");
        }
    };

    const handleDelete = (index) => {
        const updatedData = productData.filter((_, i) => i !== index);
        setProductData(updatedData);
        localStorage.setItem('productData', JSON.stringify(updatedData));
    };

    // Handle edit product
    const handleEdit = (index) => {
        const product = productData[index];
        //@ts-ignore
        Object.keys(product).forEach(key => setValue(key, product[key]));
    };


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
                            >
                                {categoryList.map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    <InputLabel>Title</InputLabel>
                    <Controller
                        name="title"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ margin: 0 }}
                                type="text"
                                fullWidth
                                margin="normal"
                                required
                                size="small"
                            />
                        )}
                    />
                    <InputLabel>Product Image</InputLabel>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                type="file"
                                variant="outlined"
                                onChange={(e) => {
                                    const fileUrl = URL.createObjectURL(e.target.files[0]);
                                    field.onChange(fileUrl)
                                }}
                                inputProps={{
                                    accept: "image/*", // Limit file selection to images
                                }}
                                fullWidth
                                size="small"
                            />
                        )}
                    />

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
                                    margin: 0
                                }}
                            />
                        )}
                    />

                    {/* <InputLabelX label="Category"
                        htmlFor={"category"} /> */}



                    <InputLabel>Material</InputLabel>
                    <Controller
                        name="material"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ margin: 0 }}
                                type="text"
                                fullWidth
                                margin="normal"
                                required
                                size="small"
                            />
                        )}
                    />


                    <InputLabel>Size</InputLabel>
                    <Controller
                        name="size"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ margin: 0 }}
                                type="text"
                                fullWidth
                                margin="normal"
                                required
                                size="small"
                            />
                        )}
                    />

                    <InputLabel>Brand</InputLabel>
                    <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ m: 0 }}
                                type="text"
                                fullWidth
                                margin="normal"
                                required
                                size="small"
                            />
                        )}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "40px" }}>
                        Submit
                    </Button>
                </form>
            </Drawer>
            <Grid container spacing={3}>
                {productData.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{product.title}</Typography>
                                <Typography variant="body2">{product.description}</Typography>
                                <Typography variant="body2">Category: {product.category}</Typography>
                                <Typography variant="body2">Material: {product.material}</Typography>
                                <Typography variant="body2">Size: {product.size}</Typography>
                                <Typography variant="body2">Brand: {product.brand}</Typography>
                                <Box sx={{ mt: 2 }}>
                                    {product?.image && <img src={product?.image} alt="product" style={{ maxWidth: '100%' }} />}
                                </Box>

                                {/* Edit and Delete buttons */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <IconButton onClick={() => { handleEdit(index); setDrawerOpen(true) }} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(index)} color="secondary">
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
