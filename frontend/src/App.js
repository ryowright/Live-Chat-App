import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import Dashboard from './components/dashboard/dashboard';
import rootReducer from './reducers/combine';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import ProtectedRoute from './components/routes/protectedroute';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Chatroom from './components/chatroom/chatroom';

class App extends React.Component {
    store = createStore(rootReducer, applyMiddleware(thunk));

    render() {
        return (
            <div>
            <Provider store={this.store}>
            <Router>
            {localStorage.getItem('route') ? <Redirect to={`${localStorage.getItem('route')}`}/> : ""}
            <Switch>
                <ProtectedRoute exact path="/" component={Dashboard} />
                <ProtectedRoute exact path="/join-chatroom/:roomName" component={Chatroom} />
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
            </Switch>
            </Router>
            </Provider>
            </div>
        )
    }
}

export default App