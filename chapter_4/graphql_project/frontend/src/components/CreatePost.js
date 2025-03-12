import React, { useState } from 'react';
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
  const [author, setAuthor] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('author', author);
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://0.0.0.0:8000/api/posts', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        console.log(await response.json());
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log(data);
      navigate(`/post/${data.id}`);
    } catch (err) {
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
        <TextField
          fullWidth
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
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