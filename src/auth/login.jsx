import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Asterisk = (
  <Typography component="span" color="#FF0266" sx={{ fontSize: "24px" }}>
    *
  </Typography>
);
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  // .matches(/^\d{7,9}$/, "SSN No. must be 7-8 digits long"),
});

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate()
  if (loading) {
    // Show loader while loading
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9", // Optional background color
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post("https://jainsons-pvt.vercel.app/api/auth/signin", data);
      console.log(response, 'response')
      if (response.data) {
        setSuccessMsg("Login successful!");
        localStorage.setItem("token", response.data.token);
        navigator('/dashboard')
      } else {
        setErrorMsg("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Error logging in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "#DD781E",
          width: "100vw",
          p: 3,
          boxSizing: "border-box",
        }}
        className="water-mark"
      >
        <Box
          display={"flex"}
          sx={{
            width: "50%",
            boxSizing: "border-box",
          }}
          position={"absolute"}
          zIndex={999}
        >
          <Box
            className="login-image-box"
            sx={{
              flex: 1,
            }}
          ></Box>
          <Box
            sx={{
              paddingX: 3,
              flex: 1,
              paddingY: 4,
              background: "#DD781E",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", color: "#f2f4f4" }}
            >
              Welcome to our manage Content and products seamlessly portal
            </Typography>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Box>
                    <InputLabel
                      sx={{
                        color: "white !important",
                        fontWeight: "bold",
                        marginBottom: "8px",
                      }}
                    >
                      Email Id: {Asterisk}
                    </InputLabel>
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      helperText={errors.email?.message}
                      InputProps={
                        {
                          // style: { color: "#fff" },
                        }
                      }
                      placeholder="example@gmail.com"
                      InputLabelProps={{
                        style: { color: "#ccc" },
                      }}
                      sx={{
                        "& .MuiFormHelperText-root": {
                          textAlign: "end",
                          color: "#01AAE9 !important",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#F2F4F4", // Change background color
                          color: "#121212",
                        },
                      }}
                    />
                  </Box>
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Box>
                    <InputLabel
                      sx={{
                        color: "white !important",
                        fontWeight: "bold",
                        marginBottom: "8px",
                      }}
                    >
                      Password: {Asterisk}
                    </InputLabel>
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      // error={!!errors.SSN}
                      helperText={errors.password?.message}
                      InputProps={
                        {
                          // style: { color: "#fff" },
                        }
                      }
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiFormHelperText-root": {
                          textAlign: "end",
                          color: "#01AAE9 !important",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#F2F4F4", // Change background color
                          color: "#121212",
                        },
                      }}
                    />
                  </Box>
                )}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#fff",
                  color: "#000",
                  textTransform: "none",
                  ":hover": {
                    bgcolor: "#1565C0",
                  },
                  py: 1,
                }}
              >
                Login
              </Button>
            </form>
          </Box>
        </Box>
      </Box>

    </>
  );
};

export default Login;