import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    await logout();
  };

  const navButtonStyle = {
    mx: 1,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: '64px' }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Social Blog
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/"
                  startIcon={<HomeIcon />}
                  sx={navButtonStyle}
                >
                  {!isMobile && 'Home'}
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/create"
                  startIcon={<CreateIcon />}
                  sx={navButtonStyle}
                >
                  {!isMobile && 'Create Post'}
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/following"
                  startIcon={<GroupIcon />}
                  sx={navButtonStyle}
                >
                  {!isMobile && 'Following'}
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/${user.user.username}`}
                  startIcon={<PersonIcon />}
                  sx={navButtonStyle}
                >
                  {!isMobile && 'Profile'}
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={navButtonStyle}
                >
                  {!isMobile && 'Logout'}
                </Button>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    ml: 2,
                    p: 1,
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  <Avatar
                    src={user?.avatar ? 'http://0.0.0.0:8000/media/' + user?.avatar : null}
                    alt={user.user.username}
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                    }}
                  />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'inherit',
                      fontWeight: 500,
                    }}
                  >
                    {user.user.username}
                  </Typography>
                </Box>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => setShowLoginModal(true)}
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </AppBar>
  );
}

export default Navbar; 