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
  Alert,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      avatar
      bio
      dateOfBirth
      location
      postsCount
      followersCount
      followingCount
    }
  }
`;

const UPDATE_AVATAR = gql`
  mutation UpdateAvatar($avatar: Upload!) {
    updateAvatar(avatar: $avatar)
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($bio: String, $location: String, $dateOfBirth: String) {
    updateProfile(bio: $bio, location: $location, dateOfBirth: $dateOfBirth)
  }
`;


const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState({
    bio: '',
    avatar: null,
    dateOfBirth: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [updateAvatar] = useMutation(UPDATE_AVATAR);

  const { data, loading, error: queryError } = useQuery(GET_CURRENT_USER);

  useEffect(() => {
    if (data) {
      setProfile({
        bio: data.me.bio,
        avatar: data.me.avatar,
        dateOfBirth: data.me.dateOfBirth,
        location: data.me.location,
      });
    }
  }, [data]);

  if (loading) return <Typography>Loading...</Typography>;
  if (queryError) return <Typography>Error: {queryError.message}</Typography>;
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data: updateData } = await updateProfile({
        variables: {
          bio: profile.bio,
          location: profile.location,
          dateOfBirth: profile.dateOfBirth,
        },
      });
      if (updateData?.updateProfile) {
        setProfile(prevProfile => ({
          ...prevProfile,
          bio: updateData.updateProfile.bio || prevProfile.bio,
          location: updateData.updateProfile.location || prevProfile.location,
          dateOfBirth: updateData.updateProfile.dateOfBirth || prevProfile.dateOfBirth,
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Avatar size should not exceed 5MB');
        return;
      }

      // Проверяем формат файла
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
        setError('HEIC format is not supported. Please convert your image to JPEG or PNG before uploading.');
        return;
      }

      // Проверяем что это изображение
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      try {
        await updateAvatar({
          variables: {
            avatar: file,
          },
          refetchQueries: [{ query: GET_CURRENT_USER }]
        });
        setError('');
      } catch (error) {
        console.error('Error updating avatar:', error);
        setError('Failed to update avatar. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={profile?.avatar ? `http://0.0.0.0:8000/media/${profile.avatar}` : null}
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
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Supported formats: JPEG, PNG, GIF, WebP
              </Typography>
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
              <Typography variant="h6">{data.me.postsCount}</Typography>
              <Typography color="textSecondary">Posts</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6">{data.me.followersCount}</Typography>
              <Typography color="textSecondary">Followers</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6">{data.me.followingCount}</Typography>
              <Typography color="textSecondary">Following</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 