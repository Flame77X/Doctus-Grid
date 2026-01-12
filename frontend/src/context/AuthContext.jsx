import { createContext, useContext, useEffect, useState } from 'react';
import { account, client } from '../lib/appwrite';
import { ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const current = await account.get();
            // Flatten prefs into user object for easy access
            setUser({ ...current, ...current.prefs });
        } catch (error) {
            console.log('No active session');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (name, subject) => {
        try {
            await account.createAnonymousSession();
            await account.updateName(name);
            if (subject) {
                await account.updatePrefs({ subject });
            }
            const current = await account.get();
            setUser({ ...current, ...current.prefs });
            return current;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    useEffect(() => {
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
