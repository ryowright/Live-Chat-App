import { React, useState } from 'react';
import { Grid, TextField, Button, InputAdornment, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle, LockRounded, EmailRounded } from '@material-ui/icons';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './auththeme';
import { Link, Redirect } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { register } from '../../actions/auth';
import { useDispatch, useSelector } from 'react-redux';

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

const Register = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [err, setErr] = useState("");
  const [showErr, setShowErr] = useState(false);

  const { isAuth } = useSelector(state => ({
    isAuth: state.auth.isAuth,
  }))

  const handleRegister = () => {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confPassword = document.getElementById("confirmPassword").value;

    if(password !== confPassword) {
      setErr("Passwords do not match.");
      return setShowErr(true);
    }

    dispatch(register(email, username, password));
  }

  if (isAuth){
    return <Redirect to="/"/>
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
            id="email"
            type="email"
            label="Email"
            margin="normal"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <EmailRounded />
                    </InputAdornment>
                ),
            }}
            />
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
          <TextField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
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
          <Button color="primary" variant="contained" onClick={handleRegister}>
              Sign Up
          </Button>
          <div style={{ height: 20 }} />
          <Collapse in={showErr}>
          <Alert severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowErr(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {err}
        </Alert>
        </Collapse>
          <Link align="center" to="/login">Already have an account? Login here.</Link>
        </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Register;