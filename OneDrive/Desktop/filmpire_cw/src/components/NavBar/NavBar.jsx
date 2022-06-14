import React from 'react';
import { AppBar, Avatar, Button, Drawer, IconButton, Toolbar, useMediaQuery } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useStyles from './styles';

const NavBar = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:600px)');

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
