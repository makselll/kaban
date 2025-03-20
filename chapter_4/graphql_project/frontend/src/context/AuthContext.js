import React, { createContext, useState, useContext, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

const AuthContext = createContext(null);

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      user {
        id
        username
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $username: String!, $password: String!, $password2: String!) {
    register(input: {email: $email, username: $username, password: $password, password2: $password2}) {
      id
      user {
        id
        username
      }
    }
  }

`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      user {
        id
        username
      }
      avatar
      bio
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
    console.log("userData >", userData);
    if (userData?.me) {
      setUser(userData.me);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData.me));
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [userData]);

  const handleLogin = async (username, password) => {
    try {
      const { data, errors } = await login({
        variables: {
          username,
          password
        },
      });
      if (errors) {
        throw new Error(errors[0].message);
      }
      setIsAuthenticated(true);
      setUser(data.login);
      return data.login.id;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await logout();
      if (data.logout) {
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
      if (data.register) {
        setIsAuthenticated(true);
        setUser(data.register);
        return { success: true, data: data.register.id };
      }
      return { success: false, error: 'Registration failed. Please try again.' };
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