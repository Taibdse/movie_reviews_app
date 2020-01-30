import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import "toastr/build/toastr.min.css";
import 'antd/dist/antd.css';
import './App.css';
// import moduleName from 'react';
import GlobalContext from './contexts';

import SearchMoviePage from './pages/SearchMoviePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';

import { getTokenFromLocal, setAuthHeader } from './config/auth';
import ValidationUtils from './utils/validation';

function App() {

  useEffect(() => {
    const token = getTokenFromLocal();
    if(ValidationUtils.isEmpty(token)){
      setAuthHeader(null);
      if(window.location.pathname != '/login') window.location.href = '/login';
    } else {
      setAuthHeader(token);
    }
  }, []);

  return (
    <GlobalContext>
      <Router>
        <Switch>
          <Route exact path="/" component={SearchMoviePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/movies" component={SearchMoviePage} />
          <Route exact path="/movie-details/:movieSlug" component={MovieDetailsPage} />
        </Switch>
      </Router>
    </GlobalContext>
  );
}

export default App;
