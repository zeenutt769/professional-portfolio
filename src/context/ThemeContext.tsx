import { createContext } from 'react';

export const ThemeContext = createContext({
    theme: 'minDark',
    setTheme: (_theme: string) => { },
    installedThemes: [] as string[],
    installTheme: (_theme: string) => { },
    uninstallTheme: (_theme: string) => { },
    homepageLayout: 'modern' as 'modern' | 'vscode',
    setHomepageLayout: (_layout: 'modern' | 'vscode') => { }
});
