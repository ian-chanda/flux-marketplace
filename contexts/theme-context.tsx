import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useEffect,
    useState
} from 'react';
import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

type Theme = {
    theme: string,
    toggleTheme: () => void
};

const STORAGE_KEY = 'theme';


export const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeMode>('light');

    // load theme on init
    useEffect(() => {
        const loadTheme = async () => {
            // if (typeof window === 'undefined') return 'light'
            let saved;
            if (Platform.OS === 'web')
                saved = localStorage.getItem(STORAGE_KEY)
            else
                saved = await AsyncStorage.getItem(STORAGE_KEY);

            if (saved === 'light' || saved === 'dark') 
                setTheme(saved);
            // return window.matchMedia('(prefers-color-scheme: dark)').matches
            //     ? 'dark' : 'light';
        };
        loadTheme();
    }, [])

    // save the theme when theme changed
    useEffect(() => {
        if (Platform.OS === 'web')
            localStorage.setItem(STORAGE_KEY, theme)
        else
            AsyncStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
