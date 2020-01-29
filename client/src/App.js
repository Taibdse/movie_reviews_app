import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
// import moduleName from 'react';
import SearchMoviePage from './pages/SearchMoviePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={SearchMoviePage} />
          <Route exact path="/movies" component={SearchMoviePage} />
          <Route exact path="/movie-details/:movieSlug" component={MovieDetailsPage} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
