'use client';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {icon && (
                <div className="mb-4 text-gray-500">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 max-w-md mb-6">
                    {description}
                </p>
            )}
            {action && action}
        </div>
    );
}
