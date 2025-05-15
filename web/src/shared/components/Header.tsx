import {
	AddNewTaskForm,
	DeleteBoardDialog,
	FormEditBoard,
	MobileMenuPopover,
	PopoverEditOrDeleteBoard
} from '~/shared/components';

import { useAuthStore } from '~/stores/auth-store';
import { useMenuStore } from '~/stores/menu-store';

import { useActiveBoard } from '~/hooks';

import { cn } from '~/utils/cn';

import KanbanLogoSvg from '~/assets/logo.svg';

import { AvatarProfile } from './AvatarProfile';

const getUserInitialLetters = (name: string) =>
	name
		.split(' ')
		.filter(Boolean)
		.map((l) => l[0])
		.join('')
		.substring(0, 2);

export function Header() {
	const { activeBoard, setActiveBoard } = useActiveBoard();
	const { isMenuOpen } = useMenuStore();
	const user = useAuthStore((state) => state.user);

	return (
		<header className="border-linesLight dark:bg-darkGrey dark:border-linesDark h-20 border-b px-6 pr-3">
			<nav className="flex h-full w-full items-center justify-between">
				<div
					className={cn(
						'border-r-linesLight dark:border-r-linesDark h-full items-center gap-2 border-r pr-8 hidden',
						{
							'md:hidden': isMenuOpen,
							'md:flex': !isMenuOpen
						}
					)}
				>
					<KanbanLogoSvg />
					<p className="text-3xl font-bold leading-relaxed text-black dark:text-white">
						Kanban
					</p>
				</div>

				<div className="flex flex-1 items-center justify-between">
					<div
						className={cn('flex gap-2', {
							'md:ml-6': !isMenuOpen
						})}
					>
						<span className="md:hidden">
							<KanbanLogoSvg />
						</span>

						<h2
							className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold capitalize leading-relaxed dark:text-white sm:max-w-[250px] md:max-w-xs md:text-xl"
							title={activeBoard?.name}
						>
							{activeBoard?.name ?? 'No board selected'}
						</h2>
						<MobileMenuPopover />
					</div>

					<div className="flex items-center gap-3">
						<AddNewTaskForm activeBoard={activeBoard} />
						{activeBoard && (
							<PopoverEditOrDeleteBoard>
								<>
									<FormEditBoard
										board={activeBoard}
										setUpdatedBoard={setActiveBoard}
									/>
									<DeleteBoardDialog
										id={activeBoard.id}
										name={activeBoard.name}
									/>
								</>
							</PopoverEditOrDeleteBoard>
						)}
						{user && (
							<AvatarProfile
								avatarUrl={user.avatarUrl}
								fallbackText={getUserInitialLetters(user.name)}
							/>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
