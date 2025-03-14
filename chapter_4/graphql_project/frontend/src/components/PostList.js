import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Avatar, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      image
      profile {
        id
        avatar {
          path
        }
        user {
          id
          username
        }
      }
      createdAt
    }
  }
`;

function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Grid container spacing={4}>
      {data.posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={'http://0.0.0.0:8000/media/' + post.image}
              alt={post.title}
            />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={post.profile.avatar ? 'http://0.0.0.0:8000/media/' + post.profile.avatar : null}
                  alt={post.profile.user.username}
                  sx={{ mr: 1 }}
                />
                <Typography variant="caption">
                  By {post.profile.user.username}
                </Typography>
              </Box>
              <Typography gutterBottom variant="h5" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {post.content}
              </Typography>
              <Button
                component={Link}
                to={`/post/${post.id}`}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PostList; 