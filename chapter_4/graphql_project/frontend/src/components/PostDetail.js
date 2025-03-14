import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation, useSubscription } from '@apollo/client';
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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      image
      createdAt
      profile {
        id
        user {
          username
          id
        }
        avatar {
          path
        }
      }
      comments {
        id
        content
        profile {
          id
          user {
            username
          }
        }
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) 
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
    updatePost(input: {id: $id, title: $title, content: $content}) {
      id
      title
      content
    }
  }
`;

const FOLLOW_PROFILE = gql`
  mutation FollowProfile($id: ID!) {
    follow(id: $id)
  }
`;

const UNFOLLOW_PROFILE = gql`
  mutation UnfollowProfile($id: ID!) {
    unfollow(id: $id)
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(input: { postId: $postId, content: $content }) {
      id
      content
      profile {
        id
        user {
          username
        }
      }
      createdAt
    }
  }
`;

const COMMENT_CREATED = gql`
  subscription OnCommentCreated($postId: ID!) {
    commentCreated(postId: $postId) {
      id
      content
      profile {
        id
        user {
          username
        }
      }
      
    }
  }
`;

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: parseInt(id) },
  });

  const [deletePost] = useMutation(DELETE_POST);
  const [updatePost] = useMutation(UPDATE_POST);
  const [followProfile] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);
  const [createComment] = useMutation(CREATE_COMMENT);

  const { data: subscriptionData } = useSubscription(COMMENT_CREATED, {
    variables: { postId: id },
  });

  useEffect(() => {
    if (data) {
      setComments(data.post.comments);
      setIsFollowing(data.post.profile.isFollowed);
      setEditTitle(data.post.title);
      setEditContent(data.post.content);
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData?.commentCreated) {
      console.log("subscriptionData", subscriptionData)
      setComments((prevComments) => [...prevComments, subscriptionData.commentCreated]);
    }
  }, [subscriptionData]);

  const handleSubmitComment = async () => {
    if (comment.trim()) {
      try {
        await createComment({
          variables: {
            postId: parseInt(id),
            content: comment.trim(),
          },
        });
        setComment('');
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowProfile({
          variables: { id: data.post.profile.id }
        });
      } else {
        await followProfile({
          variables: { id: data.post.profile.id }
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost({
        variables: { id: parseInt(id) },
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      await updatePost({
        variables: {
          id: parseInt(id),
          title: editTitle,
          content: editContent,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const { post } = data;
  const userData = JSON.parse(localStorage.getItem('user'));
  const currentUserId = userData?.id;

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
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={'http://0.0.0.0:8000/media/' + post.profile.avatar?.path}
                alt={post.profile.user.username}
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="subtitle1">
                {post.profile.user.username}
              </Typography>
            </Box>
            <Box>
              {post.profile.user.id === currentUserId && (
                <>
                  <IconButton onClick={() => setIsEditing(true)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setOpenDialog(true)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
              {post.profile.user.id !== currentUserId && (
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  color="primary"
                  onClick={handleFollowToggle}
                  size="small"
                  sx={{ ml: 1 }}
              >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </Box>
          </Box>

          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                label="Title"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                label="Content"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdatePost}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Typography gutterBottom variant="h4" component="div">
                {post.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {post.content}
              </Typography>
            </>
          )}
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
                  secondary={`${comment.profile.user.username} - ${new Date(
                    comment.createdAt
                  ).toLocaleString()}`}
                />
              </ListItem>
              {index < comments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PostDetail; 