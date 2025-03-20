import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import heic2any from 'heic2any';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $image: Upload!) {
    createPost(input: { title: $title, content: $content, image: $image }) {
        id
        title
        content
        image
        profile {
            id
            user {
              id
              username
            }
        }
        createdAt
    }
  }
`;

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const [createPost, { loading }] = useMutation(CREATE_POST);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверяем размер файла (например, максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }

      // Проверяем тип файла и расширение
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
        setImage(file);

        // Создаем FileReader для безопасного чтения файла
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
          setError(''); // Очищаем ошибку при успешной загрузке
        };
        reader.onerror = () => {
          setError('Error reading the image file');
          setImagePreview(null);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Error processing image. Please try another format.');
        setImage(null);
        setImagePreview(null);
      }
    }
  };

  // Очищаем ресурсы при размонтировании
  useEffect(() => {
    return () => {
      if (image) {
        setImage(null);
        setImagePreview(null);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      const { data } = await createPost({
        variables: { 
          title, 
          content, 
          image: image // Передаем файл напрямую
        },
        context: {
          hasUpload: true, // Важный флаг для Apollo Client
        }
      });

      if (data?.createPost?.errors?.length) {
        setError(data.createPost.errors[0].messages.join(', '));
      } else {
        navigate(`/post/${data.createPost.id}`);
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
          accept="image/jpeg,image/png,image/gif,image/webp"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <label htmlFor="image-upload">
            <Button 
              variant="outlined" 
              component="span" 
              fullWidth
              sx={{ 
                height: '56px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Upload Image
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary">
            Supported formats: JPEG, PNG, GIF, WebP
          </Typography>

          {image && (
            <>
              <Typography variant="body2" color="text.secondary">
                Selected file: {image.name}
              </Typography>
              <Box 
                sx={{ 
                  mt: 2, 
                  width: '100%', 
                  height: '300px', 
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  position: 'relative'
                }}
              >
                {isConverting && (
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1
                  }}>
                    <CircularProgress />
                  </Box>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    onError={() => {
                      setError('Error displaying image preview');
                      setImagePreview(null);
                    }}
                  />
                )}
                {!imagePreview && error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading || isConverting || !title || !content || !image}
          sx={{ 
            height: '56px',
            borderRadius: '4px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          {loading ? 'Submitting...' : 'Create Post'}
        </Button>
      </Box>
    </Paper>
  );
}

export default CreatePost;