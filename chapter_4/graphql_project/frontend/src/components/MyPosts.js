import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_MY_POSTS = gql`
query GetMyPosts {
  myPosts {
    id
    title
    content
    image
    comments {
      id
      content
      profile {
        id
        user {
          id
          username
        }
      }
    }
  }
}
`;

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_MY_POSTS);

  useEffect(() => {
    if (data) {
      setPosts(data.myPosts);
    }
  }, [data]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6">Error: {error.message}</Typography>;

  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          My Posts
        </Typography>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={'http://0.0.0.0:8000/media/' + post.image}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.content.substring(0, 150) + '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleViewPost(post.id)}
                    sx={{ width: '100%' }}
                  >
                    View Post
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default MyPosts; 