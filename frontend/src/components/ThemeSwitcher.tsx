import { useUser } from '../state/User';
import type { ThemeType } from '../state/User/UserContext';
import '../styles/ThemeSwitcher.css';

/**
 * Theme switcher component that allows changing between different themes
 */
export const ThemeSwitcher = () => {
  const { selectedTheme, setTheme } = useUser();

  const themes: { id: ThemeType; name: string }[] = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'blue', name: 'Blue' },
    { id: 'system', name: 'System' }
  ];

  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
  };

  return (
    <div className="theme-switcher">
      <div className="theme-switcher-label">Theme:</div>
      <div className="theme-options">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-option ${selectedTheme === theme.id ? 'active' : ''}`}
            onClick={() => handleThemeChange(theme.id)}
            aria-label={`Switch to ${theme.name} theme`}
            title={`Switch to ${theme.name} theme`}
          >
            <span className="theme-option-color" data-theme={theme.id}></span>
            <span className="theme-option-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
