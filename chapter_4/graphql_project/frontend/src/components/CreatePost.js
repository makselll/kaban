import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';


function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const CREATE_POST = gql`
      mutation CreatePost($title: String!, $content: String!, $image: Upload!) {
        createPost(input: {title: $title, content: $content, image: $image}) {
          post {
            id
            title
            content
            image
            profileId
            createdAt
          },
          errors {
            field
            messages
          }
        }
      }
    `;
  const [createPost] = useMutation(CREATE_POST);

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const { data, loading, create_error } = await createPost({
          variables: {
            title,
            content,
            image,
        },
      });

      if (loading) return 'Submitting...';
      if (create_error) return setError(create_error.message);
      if (data) navigate(`/post/${data.post.id}`);

    } catch (error) {
      console.error('error:', error);
      // setError(error);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create New Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Content"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <input
          accept="image/*"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button variant="outlined" component="span" sx={{ mb: 2 }}>
            Upload Image
          </Button>
        </label>

        {image && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected file: {image.name}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={!title || !content || !image}
        >
          Create Post
        </Button>
      </Box>
    </Paper>
  );
}

export default CreatePost;