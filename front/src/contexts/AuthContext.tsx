import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false);
  const [user, setUser] = useState<any | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '') : '');
  const [token, setToken] = useState<string>(localStorage.getItem('token') ?? '');

  const login = async (email: string, password: string): Promise<boolean> => {
    return await axios.post(process.env.REACT_APP_API_URL + '/api/login', {email: email, password: password})
    .then(res => {
      setUser({
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role
      });

      setToken(res.data.token);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)

      return true
    }).catch(res => {
      return false
    })
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    return await axios.post(process.env.REACT_APP_API_URL + '/api/register', {
      name: name, 
      email: email, 
      password: password
    }).then(res => {
      return true
    }).catch(res => {
      return false
    })
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 