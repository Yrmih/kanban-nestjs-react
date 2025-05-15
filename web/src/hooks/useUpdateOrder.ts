import { useEffect, useCallback } from 'react';
import { useThemeStore } from '../stores/theme-store';

export function useTheme() {
  const { theme, setTheme } = useThemeStore();

  // Memorize a função para não criar ela a cada render
  const changeThemeInHtml = useCallback(() => {
    const html = document.documentElement;

    if (theme === 'light') {
      html.classList?.remove('dark');
      html.classList.add('light');
    } else {
      html.classList?.remove('light');
      html.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const updateThemeBasedOnPreferences = () => {
      const match = mediaQueryList.matches;

      if (match && !theme) {
        setTheme('dark');
      }
    };

    mediaQueryList.addEventListener('change', updateThemeBasedOnPreferences);

    // Executa uma vez para atualizar no início
    updateThemeBasedOnPreferences();

    return () => {
      mediaQueryList.removeEventListener(
        'change',
        updateThemeBasedOnPreferences
      );
    };
  }, [setTheme, theme]);

  useEffect(() => {
    changeThemeInHtml();
  }, [changeThemeInHtml]);

  return { theme, setTheme };
}
