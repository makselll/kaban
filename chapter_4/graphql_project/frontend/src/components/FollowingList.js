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

const FollowingList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFollowToggle = async (userId) => {
    // GraphQL mutation will be implemented here
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
                  primary={follower.username}
                  secondary={follower.bio}
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
                  primary={followed.username}
                  secondary={followed.bio}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleFollowToggle(followed.id)}
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