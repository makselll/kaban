import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
      image
      author {
        id
        username
        isFollowed
      }
      comments {
        id
        content
        author {
          username
        }
        createdAt
      }
    }
  }
`;

function PostDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [ws, setWs] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: parseInt(id) },
  });

  useEffect(() => {
    if (data) {
      setComments(data.post.comments);
      setIsFollowing(data.post.author.isFollowed);
    }
  }, [data]);


  useEffect(() => {
    const websocket = new WebSocket(`ws://0.0.0.0:8000/ws/comments/` + id + '/');

    websocket.onmessage = (event) => {
      const message_data = JSON.parse(event.data);
      console.log(message_data);
      if (message_data.type === 'new_comment') {
        setComments((prevComments) => [...prevComments, message_data.comment]);
      }
    };

    setWs(websocket);

    // Cleanup function to close WebSocket connection
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [id]); // Added id to dependency array


  const handleSubmitComment = () => {
    console.log(ws);
    if (ws && comment.trim()) {
      ws.send(
        JSON.stringify({
          post_id: parseInt(id),
          content: comment,
          user_id: 1, // Replace with actual user ID from authentication
        })
      );
      console.log(
        'send'
      );
    }
  };

  const handleFollowToggle = async () => {
    // GraphQL mutation will be implemented here
    setIsFollowing(!isFollowing);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const { post } = data;

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="400"
          image={'http://0.0.0.0:8000/media/' + post.image}
          alt={post.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {post.content}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="text.secondary">
              By {post.author.username}
            </Typography>
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              color="primary"
              onClick={handleFollowToggle}
              size="small"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add a Comment
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitComment}
          disabled={!comment.trim()}
        >
          Submit Comment
        </Button>
      </Paper>

      <Paper>
        <List>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id || index}>
              <ListItem>
                <ListItemText
                  primary={comment.content}
                  secondary={`${comment.author} - ${new Date(
                    comment.created_at
                  ).toLocaleString()}`}
                />
              </ListItem>
              {index < comments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default PostDetail; 