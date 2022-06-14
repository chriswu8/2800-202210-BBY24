import React from 'react';
import { AppBar, Avatar, Button, Drawer, IconButton, Toolbar } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  console.log('movie info');
  return (
    <>
      <AppBar>
        <h1>Nav!</h1>
      </AppBar>
    </>
  );
};

export default NavBar;
