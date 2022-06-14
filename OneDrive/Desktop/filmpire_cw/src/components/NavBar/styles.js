import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  toolbar: {
    height: '88px',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '240px',
    color: '#eddbcd',
    backgroundColor: '#192231',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0',
      flexWrap: 'wrap',
    },
  },

  menuButton: {
    height: '55px',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

}));
