import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation, useQueryClient } from "react-query";
import { loginUser } from "../../services/authQueries";
import { useAuth } from "../../context/AuthContext";
import jwt from "jsonwebtoken";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/"></Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  const {
    mutate: loginMutation,
    isLoading,
    data,
    isError,
    error,
  } = useMutation(loginUser, {
    onSuccess: (data) => {
      const decodedToken = jwt.decode(data?.access_token);
      console.log(decodedToken)
      const decodedUser = {
        usename: decodedToken.sub,
        role: decodedToken?.role[0],
      };
      localStorage.setItem("role",decodedToken?.role)
      login({ user: decodedUser, access_token: data?.access_token });
      queryClient.invalidateQueries("userData"); // Optionally, refetch user data
    },
  });
  React.useEffect(() => {
    if (data) {
      navigate("/dashboard");
    }
  }, [data, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    loginMutation(formik.values);
    if (data) {
      navigate("/dashboard");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
            <Typography variant="h6" component="h2">
              <p style={{ margin: "0px", color: "red" }}>
                {isError ? error.message : ""}
              </p>
            </Typography>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
