import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  Divider,
} from '@mui/material';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState({
    bio: '',
    avatar: null,
    dateOfBirth: '',
    location: '',
  });
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // GraphQL mutation will be implemented here
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: file });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={profile.avatar}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2 }}
              >
                Change Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {username}'s Profile
            </Typography>
            <form onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" type="submit">
                Update Profile
              </Button>
            </form>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6">{stats.postsCount}</Typography>
              <Typography color="textSecondary">Posts</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6">{stats.followersCount}</Typography>
              <Typography color="textSecondary">Followers</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6">{stats.followingCount}</Typography>
              <Typography color="textSecondary">Following</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 