import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User type
interface User {
  _id?: string; // Assuming backend sends an ID
  name: string;
  email: string;
  phone_number?: string; // Added
  role?: 'customer' | 'provider'; // Role from backend
  type: 'customer' | 'serviceprovider'; // Frontend specific type derived from role
  createdAt?: string; // Added for signup date
  accessToken?: string; // If storing token in user object
  address?: string; 
  location?: {
    type?: string;
    coordinates?: number[];
  };
  // Provider-specific fields
  service?: string;
  experience?: string;
  tradeLicense?: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  try {
  } catch (error) {
    console.error("Error in useState:", error);
  }
  console.log("UserProvider rendered");

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      } 
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
