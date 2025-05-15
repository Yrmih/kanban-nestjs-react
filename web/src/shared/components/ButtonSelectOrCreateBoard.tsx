import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonSelectOrCreateBoardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const ButtonSelectOrCreateBoard = forwardRef<
  HTMLButtonElement,
  ButtonSelectOrCreateBoardProps
>(
  ({ isActive = false, type = 'button', children, className, ...props }, ref) => {
    return (
      <button
        type={type}
        ref={ref}
        aria-pressed={isActive}
        aria-label={typeof children === 'string' ? children : 'Selecionar quadro'}
        {...props}
        className={cn(
          'group flex h-[3.18rem] w-full max-w-[16.5rem] items-center gap-3 rounded-r-full p-4 pl-6 text-left font-bold capitalize focus:outline-none transition-colors whitespace-nowrap',
          {
            'bg-purple text-white hover:bg-purpleHover focus:bg-purpleHover': isActive,
            'bg-transparent text-mediumGrey hover:bg-purple/10 focus:bg-purple focus:text-white hover:text-purple dark:hover:bg-white dark:hover:text-purple': !isActive
          },
          className
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M0 2.889C0 2.12279 0.304376 1.38796 0.846169 0.846169C1.38796 0.304376 2.12279 0 2.889 0H13.11C13.4895 -0.0001 13.8653 0.0745 14.2159 0.2196C14.5665 0.3648 14.8851 0.5775 15.1535 0.8458C15.4219 1.1141 15.6347 1.4326 15.78 1.7832C15.9252 2.1338 16 2.5095 16 2.889V13.11C16.0003 13.4895 15.9257 13.8654 15.7806 14.216C15.6356 14.5667 15.4228 14.8854 15.1545 15.1538C14.8862 15.4222 14.5676 15.6351 14.217 15.7803C13.8663 15.9255 13.4905 16.0001 13.111 16H2.89C2.5105 16.0001 2.1348 15.9255 1.7841 15.7804C1.4335 15.6352 1.1149 15.4225 0.8465 15.1542C0.5781 14.8859 0.3653 14.5674 0.22 14.2168C0.0748 13.8662 0 13.4905 0 13.111V2.889ZM1.333 8.444V13.111C1.333 13.97 2.03 14.667 2.889 14.667H9.778V8.444H1.333ZM9.778 7.111V1.333H2.888C2.4755 1.3335 2.0801 1.4978 1.7887 1.7898C1.4973 2.0818 1.3337 2.4775 1.334 2.89V7.11H9.779L9.778 7.111ZM14.667 5.778H11.11V10.222H14.666L14.667 5.778ZM14.667 11.556H11.11V14.666H13.11C13.5225 14.666 13.9181 14.5022 14.2099 14.2106C14.5017 13.919 14.6657 13.5235 14.666 13.111L14.667 11.556ZM14.667 2.89C14.6671 2.6856 14.627 2.4832 14.5488 2.2944C14.4707 2.1056 14.3561 1.934 14.2116 1.7894C14.067 1.6449 13.8955 1.5303 13.7066 1.4522C13.5178 1.374 13.3154 1.3339 13.111 1.334H11.111V4.445H14.667V2.89Z" />
        </svg>

        <span className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-left">
          {children}
        </span>
      </button>
    );
  }
);

ButtonSelectOrCreateBoard.displayName = 'ButtonSelectOrCreateBoard';
