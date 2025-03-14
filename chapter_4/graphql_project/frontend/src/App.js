import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import MyPosts from './components/MyPosts';
import FollowingList from './components/FollowingList';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';


const httpLink = createUploadLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'include',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8000/graphql/',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {children}
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route
                  path="/create"
                  element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-posts"
                  element={
                    <PrivateRoute>
                      <MyPosts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/following"
                  element={
                    <PrivateRoute>
                      <FollowingList />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Container>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App; 