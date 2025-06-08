import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../api/services/userService';
import apiClient from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// 認証方式の設定
const AUTH_METHOD = 'cookie'; // 'session', 'cookie', 'memory'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUser = async () => {
        try {
            let token = null;
            
            if (AUTH_METHOD === 'session') {
                token = sessionStorage.getItem('token');
            } else if (AUTH_METHOD === 'cookie') {
                // HttpOnly Cookieの場合、トークンはCookieに自動で含まれる
                // APIクライアントのwithCredentials: trueで自動送信
                token = 'cookie-based'; // ダミー値
            }
            
            if (!token && AUTH_METHOD !== 'cookie') {
                setLoading(false);
                return;
            }

            // SessionStorageの場合のみトークンをヘッダーに設定
            if (AUTH_METHOD === 'session' && token) {
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            const userData = await userService.getProfile();
            setUser(userData.user || userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            
            if (AUTH_METHOD === 'session') {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                delete apiClient.defaults.headers.common['Authorization'];
            }
            
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/api/login', credentials);
            const data = response.data;
            
            if (AUTH_METHOD === 'cookie') {
                const userData = data.user || data.data?.user || data;
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true };
            }

            return { success: false, error: 'トークンが取得できませんでした' };
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.data?.errors) {
                return { success: false, errors: error.response.data.errors };
            } else if (error.response?.data?.message) {
                return { success: false, error: error.response.data.message };
            }
            return { success: false, error: 'ログインに失敗しました' };
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        if (AUTH_METHOD === 'session') {
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        refetchUser: fetchUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 