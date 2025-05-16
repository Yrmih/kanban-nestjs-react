import { Outlet } from 'react-router-dom';

import { ChangeThemeButton } from '../../components/ChangeTheme';

import KanbanLogoSrc from '~/assets/logo.svg'; // renomeei pra deixar claro que é src

export function AuthLayout() {
  return (
    <main className="dark:bg-darkGrey flex min-h-screen w-full items-center justify-center p-6 md:p-0">
      <div className="flex w-full flex-col items-center gap-4 md:min-w-[384px] md:max-w-sm">
        <p className="text-mediumGrey flex items-center gap-3 text-xl font-medium dark:text-white">
          <img src={KanbanLogoSrc} alt="Kanban Logo" className="h-6 w-6 md:h-10 md:w-10" />
          Kanban
        </p>
        <Outlet />

        <div className="mt-4 w-2/4">
          <ChangeThemeButton />
        </div>
      </div>
    </main>
  );
}
