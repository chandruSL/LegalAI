'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        loading = false,
        icon,
        children,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const baseClasses = 'btn';

        const variantClasses = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            outline: 'btn-outline',
            ghost: 'hover:bg-white/5 text-gray-300',
        };

        const sizeClasses = {
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {icon && icon}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
