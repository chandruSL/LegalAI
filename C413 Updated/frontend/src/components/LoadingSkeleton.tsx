'use client';

interface LoadingSkeletonProps {
    variant?: 'text' | 'title' | 'avatar' | 'card';
    count?: number;
    className?: string;
}

export default function LoadingSkeleton({ variant = 'text', count = 1, className = '' }: LoadingSkeletonProps) {
    const variantClasses = {
        text: 'skeleton skeleton-text',
        title: 'skeleton skeleton-title',
        avatar: 'skeleton skeleton-avatar',
        card: 'skeleton h-32 w-full',
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`${variantClasses[variant]} ${className}`} />
            ))}
        </>
    );
}

export function CardSkeleton() {
    return (
        <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-4">
                <LoadingSkeleton variant="avatar" />
                <div className="flex-1 space-y-2">
                    <LoadingSkeleton variant="title" />
                    <LoadingSkeleton variant="text" className="w-3/4" />
                </div>
            </div>
            <div className="space-y-2">
                <LoadingSkeleton variant="text" />
                <LoadingSkeleton variant="text" className="w-5/6" />
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="glass-panel p-4 flex items-center gap-4">
                    <LoadingSkeleton variant="avatar" />
                    <div className="flex-1 space-y-2">
                        <LoadingSkeleton variant="text" className="w-1/3" />
                        <LoadingSkeleton variant="text" className="w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
