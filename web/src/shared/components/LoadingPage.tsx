import { useTheme } from "../../hooks/useTheme";

export function LoadingPage() {
	
	useTheme();

	return (
		<div className="dark:bg-darkGrey grid h-screen w-screen place-content-center place-items-center">
			<p className="text-mediumGrey flex animate-pulse items-center gap-3 text-3xl font-bold leading-relaxed dark:text-white md:text-5xl">
				<img
					src="/assets/logo.svg"
					loading="eager"
					alt="Logo"
					className="h-6 w-6 md:h-10 md:w-10"
				/>
				Kanban
			</p>
		</div>
	);
}
