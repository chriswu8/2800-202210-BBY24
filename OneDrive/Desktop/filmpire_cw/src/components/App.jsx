import React from 'react';
import { CssBaseline } from '@mui/material';

// used to created different pages
import { Route, Switch } from 'react-router-dom';
import { Actors, MovieInformation, Movies, NavBar, Profile } from '.';
import useStyles from './styles';

// / -> root -> all movies
// /abc123 -> movie information -> more

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* Switch shows only one route at a time (so don't include navbar) */}
        <Switch>
          <Route exact path="/">
            <h1><Movies /></h1>
          </Route>
          <Route exact path="/movie/:id">
            <h1><MovieInformation /></h1>
          </Route>
          <Route exact path="/actors/:id">
            <h1><Actors /></h1>
          </Route>
          <Route exact path="/profile/:id">
            <h1><Profile /></h1>
          </Route>
        </Switch>
      </main>
    </div>

  );
};

export default App;
