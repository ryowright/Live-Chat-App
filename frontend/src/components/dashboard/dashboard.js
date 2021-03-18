import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField, Button, Typography} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../auth/auththeme';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { logout, getUser } from '../../actions/auth';
import { createChatroom, joinChatroom } from '../../actions/chatroom';
import { deleteAllChatrooms } from '../../actions/chatroom';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

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

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [join, setJoin] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [displayMsg, setDisplayMsg] = useState(false);

  useEffect(() => {
    localStorage.setItem('route', '/');
  });

  const { chatRoomFound, message } = useSelector(state => ({
    chatRoomFound: state.chatroom.chatRoomFound,
    message: state.chatroom.message
  }));

  useEffect(() => {
    dispatch(getUser());
  });

  const handleCreateDialog = () => {
    setJoin(false);
    setOpen(true);
  }

  const handleJoinDialog = () => {
    setJoin(true);
    setOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleJoin = () => {
    setRoomName(document.getElementById('roomName').value);
    dispatch(joinChatroom(roomName));
  }

  const handleCreate = () => {
    setRoomName(document.getElementById('roomName').value);
    dispatch(createChatroom(roomName));
  }

  const handleDeleteChatrooms = () => {
    dispatch(deleteAllChatrooms());
    setDisplayMsg(true);
  }

  if(chatRoomFound) {
    return <Redirect to={"/join-chatroom/" + roomName}/>
  }

  return(
  <div className={classes.root} >
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
            <Typography variant="h2" align="center">Chat Rooms</Typography>
          </ThemeProvider>
          <div style={{ height: 20 }} />
          <Button color="primary" variant="contained" onClick={handleCreateDialog}>
              Create A Chatroom
          </Button>
          <div style={{ height: 20 }} />
          <Button color="primary" variant="contained" onClick={handleJoinDialog}>
              Join A Chatroom
          </Button>
          <div style={{ height: 20 }} />
          <Button color="primary" variant="contained" onClick={handleDeleteChatrooms}>
              Delete All My Chatrooms
          </Button>
          <div style={{ height: 20 }} />
          <Button color="primary" variant="contained" onClick={handleLogout}>
              Logout
          </Button>
          <div style={{ height: 20 }} />
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{ join ? 'Join A Chatroom' : 'Create A Chatroom'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              join ?
              'Please enter the room name of the chatroom you would like to join.' :
              'Please enter a name for the chatroom.'
            }
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="roomName"
            label="Chatroom Name"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={join ? handleJoin : handleCreate} color="primary">
            {join ? 'Join' : 'Create'}
          </Button>
        </DialogActions>
        </Dialog>
        <Collapse in={displayMsg}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setDisplayMsg(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
        </Collapse>
        </div>
        </Grid>
      </Grid>
    </div>
  </div>
  )
}

export default Dashboard;