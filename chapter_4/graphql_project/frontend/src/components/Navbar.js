import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Social Blog
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Home
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/create"
              >
                Create Post
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/my-posts"
              >
                My Posts
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/following"
              >
                Following
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to={`/profile/${user?.username}`}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </AppBar>
  );
}

export default Navbar; 