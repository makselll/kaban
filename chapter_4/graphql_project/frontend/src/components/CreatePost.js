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

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $image: Upload!) {
    createPost(input: { title: $title, content: $content, image: $image }) {
      post {
        id
        title
        content
        image
        profileId
        createdAt
      }
      errors {
        field
        messages
      }
    }
  }
`;

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const [createPost, { loading }] = useMutation(CREATE_POST);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image', image);

      const { data } = await createPost({
        variables: { title, content, image }, // Передаем image напрямую
      });

      if (data?.createPost?.errors?.length) {
        setError(data.createPost.errors[0].messages.join(', '));
      } else {
        navigate(`/post/${data.createPost.post.id}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
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
          disabled={loading || !title || !content || !image}
        >
          {loading ? 'Submitting...' : 'Create Post'}
        </Button>
      </Box>
    </Paper>
  );
}

export default CreatePost;