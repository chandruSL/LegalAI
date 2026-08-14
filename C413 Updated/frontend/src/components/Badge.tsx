'use client';

interface BadgeProps {
    variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
    className?: string;
}

export default function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
    const baseClasses = 'badge';

    const variantClasses = {
        primary: 'badge-primary',
        success: 'badge-success',
        error: 'badge-error',
        warning: 'badge-warning',
        info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
