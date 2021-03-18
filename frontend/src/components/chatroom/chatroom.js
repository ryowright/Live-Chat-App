import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField, Button, Paper} from '@material-ui/core';
import { io } from "socket.io-client";
import { getUser } from '../../actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import './chatroom.css'
import { Redirect, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  background: {
    minHeight: "100vh",
    backgroundColor: "#8c8c8c"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    position: "relative"
  },
  chatform: {
    minWidth: "100vh",
    height: "70vh",
    overflow: 'auto',
    backgroundColor: "#ffe5c3",
    position: "relative"
  },
  inputForm: {
    minWidth: "100vh",
    padding: theme.spacing(0),
  },
  messageInput: {
    padding: theme.spacing(2),
    minWidth: "80vh",
    margin: "auto",
    float: "left",
  },
  sendBtn: {
    padding: theme.spacing(2),
    float: "left",
    height: "40px",
    margin: "auto",
    width: "10vh",
  },
  messages: {
    listStyle: "none",
    margin: 0,
    padding: 0
  },
}));

const Chatroom = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [socketio, setSocketio] = useState();
  const [leave, setLeave] = useState(false);

  const { name } = useSelector(state => ({
    name: state.auth.username
  }));

  useEffect(() => {
    dispatch(getUser())
  })

  useEffect(() => {
    const socket = io("http://localhost:8080");
    if(name) {
      socket.on("connect", () => {
        console.log(`Connected to socket id: ${socket.id}`);
      });
  
      socket.emit('join', {roomName: props.match.params.roomName, username: name}) 
    }

    socket.on('chat message', (msg, username) => {
      var messages = document.getElementById('messages');
      var item = document.createElement('li');
      item.textContent = username + ": " + msg;
      messages.appendChild(item);
      const form = document.getElementById('chatForm');
      form.scrollTop = form.scrollHeight;
    })

    socket.on('broadcast message', msg => {
      var messages = document.getElementById('messages');
      var item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      const form = document.getElementById('chatForm');
      form.scrollTop = form.scrollHeight;
    })

    setSocketio(socket);
  }, [name])

  useEffect(() => {
    localStorage.setItem('route', `/join-chatroom/${props.match.params.roomName}`);
  });

  const handleLeaveRoom = () => {
    localStorage.setItem('route', '/');
    setLeave(true);
  }

  if(leave) {
    return <Redirect to="/"/>
  }

  const sendMsg = () => {
    const msg = document.getElementById('message').value;
    socketio.emit('chat message', msg, props.match.params.roomName, name);
    document.getElementById('message').value = '';
    document.getElementById('message').focus();
  }

  return (
    <div className={classes.root} >
    <div style={{height: "100vh"}}>
      <Grid container direction="column" alignItems="center" justify="center" className={classes.background}>
      <a href="/">
      <Button
      variant="contained"
      color="primary"
      onClick={handleLeaveRoom}
      >
      Leave Room
      </Button>
      </a>
        <Grid 
          container
          item 
          xs={12} 
          alignItems="center"
          direction="column"
          justify="space-between"
          style={{ padding: 10 }}
        >
          <Paper id="chatForm" className={classes.chatform} >
            <Grid container direction="column">
              <ul id="messages" className={classes.messages}></ul>
            </Grid>
          </Paper>
          <div style={{height: '20px'}} />
          <Paper className={classes.inputForm}>
            <Grid container item md={12} style={{bottom: 0}}>
              <TextField
                className={classes.messageInput}
                id="message"
                type="text"
                placeholder="Enter message"
                margin="normal"
                variant="filled"
                autoFocus
              />
              <Button
                className={classes.sendBtn}
                variant="contained"
                color="primary"
                onClick={sendMsg}
              >
                Send
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
    </div>
  )
}

export default Chatroom;