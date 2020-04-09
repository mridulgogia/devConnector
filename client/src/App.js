import React, {Component} from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import { setCurrentUser, logoutUser } from './actions/authAction';

class App extends Component {

  componentDidMount() {
    if(localStorage.getItem('jwtToken')) {
      setAuthToken(localStorage.getItem('jwtToken'));

      const decoded = jwt_decode(localStorage.jwtToken);

      store.dispatch(setCurrentUser(decoded));

      const currentTime = Date.now() / 1000;
      if(decoded.exp < currentTime) {
        store.dispatch(logoutUser());

        this.props.history.push('/login');
      }
    }
  }

  render(){
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route 
              path="/"
              exact 
              component={Landing}
            />
            <div className="container">
              <Route  
                path="/register"
                exact
                component={Register}
              />
              <Route  
                path="/login"
                exact
                component={Login}
              />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
