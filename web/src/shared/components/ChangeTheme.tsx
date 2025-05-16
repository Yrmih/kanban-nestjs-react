import * as Switch from '@radix-ui/react-switch';

import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

import SunSvg from '~/assets/sun.svg';
import MoonSvg from '~/assets/moon.svg';

export function ChangeThemeButton() {
  const { theme, setTheme } = useTheme();

  function handleChangeTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <div
      role="button"
      className="bg-lightGrey dark:bg-veryDarkGrey flex h-12 w-full items-center justify-evenly rounded"
    >
      <img src={SunSvg} alt="Sun icon" className="h-6 w-6" />
      
      <Switch.Root
        aria-label="Switch between dark and light mode"
        checked={theme === 'dark'}
        onCheckedChange={handleChangeTheme}
        className="bg-purple dark:focus:ring-offset-veryDarkGrey focus:ring-purple relative flex h-5 w-10 items-start rounded-full px-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"
      >
        <Switch.Thumb asChild>
          <span
            className={cn(
              'transition-transform absolute top-1/2 -translate-y-1/2 block',
              {
                'translate-x-4': theme === 'dark',
              }
            )}
          >
            <svg width={15} height={15}>
              <circle cx="50%" cy="50%" r="50%" fill="white" />
            </svg>
          </span>
        </Switch.Thumb>
      </Switch.Root>
      
      <img src={MoonSvg} alt="Moon icon" className="h-6 w-6" />
    </div>
  );
}
