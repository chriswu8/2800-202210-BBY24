import React from 'react';
import { AppBar, Avatar, Button, Drawer, IconButton, Toolbar } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useStyles from './styles';

const NavBar = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <h1>Nav!!!</h1>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
