import React from 'react';
import { Grid, TextField, Button, InputAdornment, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle, LockRounded } from '@material-ui/icons';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './auththeme';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { login } from '../../actions/auth';

const useStyles = makeStyles((theme) => ({
  background: {
    minHeight: "100vh",
    backgroundColor: "#8c8c8c"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { isAuth } = useSelector(state => ({
    isAuth: state.auth.isAuth,
  }))

  if (isAuth){
    return <Redirect to="/"/>
  }

  const handleLogin = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    dispatch(login(username, password));
  }

  return (
    <div style={{height: "100vh"}}>
      <Grid container direction="column" alignItems="center" justify="center" className={classes.background}>
        <Grid 
          container
          item 
          xs={12} 
          alignItems="center"
          direction="column"
          justify="space-between"
          style={{ padding: 10 }}
        >
        <div />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
          <ThemeProvider theme={theme}>
            <Typography variant="h2" align="center">Live Chat App</Typography>
          </ThemeProvider>
          <TextField 
            id="username"
            label="Username"
            margin="normal"
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
            }}
          />
          <TextField
            id="password"
            type="password"
            label="Password"
            margin="normal"
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRounded />
              </InputAdornment>
            ),
            }}
          />
          <div style={{ height: 20 }} />
          <Button color="primary" variant="contained" onClick={() => handleLogin()}>
              Log in
          </Button>
          <div style={{ height: 20 }} />
          <Link className="sign-up-link" align="center" to="/register">Don't have an account? Sign up here.</Link>
        </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login;