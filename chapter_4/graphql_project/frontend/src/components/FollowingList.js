import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_FOLLOWERS = gql`
  query {
    followers {
      id
      avatar
      user {
        id
        username
      }

    },
    following {
      id
      avatar
      user {
        id
        username
      }
    }
  }
`;

const FOLLOW_PROFILE = gql`
  mutation followProfile($id: ID!) {
    follow(id: $id)
  }
`;

const UNFOLLOW_PROFILE = gql`
  mutation unfollowProfile($id: ID!) {
    unfollow(id: $id)
  }
`;

const FollowingList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followProfile, { follow_loading }] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile, { unfollow_loading }] = useMutation(UNFOLLOW_PROFILE);
  const { loading, error, data } = useQuery(GET_FOLLOWERS);

  useEffect(() => {
    if (data) {
      setFollowers(data.followers);
      setFollowing(data.following);
    }
  }, [data]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFollowToggle = async (userId) => {
    try {
      await followProfile({
        variables: { id: userId },
        refetchQueries: [{ query: GET_FOLLOWERS }]
      });
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollowToggle = async (userId) => {
    try {
      await unfollowProfile({
        variables: { id: userId },
        refetchQueries: [{ query: GET_FOLLOWERS }]
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Followers" />
          <Tab label="Following" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <List>
            {followers.map((follower) => (
              <ListItem key={follower.id} divider>
                <ListItemAvatar>
                  <Avatar src={follower.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={follower.user.username}
                  secondary={follower.user.bio}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleFollowToggle(follower.id)}
                  >
                    Follow Back
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {following.map((followed) => (
              <ListItem key={followed.id} divider>
                <ListItemAvatar>
                  <Avatar src={followed.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={followed.user.username}
                  secondary={followed.user.bio}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleUnfollowToggle(followed.id)}
                  >
                    Unfollow
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default FollowingList; 