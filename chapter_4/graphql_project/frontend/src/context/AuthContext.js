import React, { createContext, useState, useContext, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

const AuthContext = createContext(null);

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      profile {
        id
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $username: String!, $password: String!, $password2: String!) {
    register(email: $email, username: $username, password: $password, password2: $password2) {
      profile {
        id
      }
    }
  }

`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      bio
      avatar
      dateOfBirth
      location
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [login] = useMutation(LOGIN_MUTATION);
  const [logout] = useMutation(LOGOUT_MUTATION);
  const [register] = useMutation(REGISTER_MUTATION);
  const { data: userData, loading } = useQuery(GET_CURRENT_USER);

  useEffect(() => {
    if (userData?.me) {
      setUser(userData.me);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [userData]);

  const handleLogin = async (username, password) => {
    try {
      const { data } = await login({
        variables: {
          username,
          password
        }
      });
      setIsAuthenticated(true);
      return data.login.profile.id;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await logout();
      if (data.logout.success) {
        setUser(null);
        setIsAuthenticated(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const handleRegister = async (username, email, password, password2) => {
    try {
      const { data } = await register({
        variables: {
          username,
          email,
          password,
          password2
        }
      });
      setIsAuthenticated(true);
      return { success: true, data: data.profile.id };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 