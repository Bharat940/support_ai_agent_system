import React from 'react';

interface AvatarProps {
    src?: string;
    fallback?: React.ReactNode;
    alt?: string;
    className?: string;
}

export function Avatar({ src, fallback, alt, className = '' }: AvatarProps) {
    const [imageError, setImageError] = React.useState(false);

    return (
        <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 ${className}`}>
            {src && !imageError ? (
                <img
                    src={src}
                    alt={alt}
                    className="aspect-square h-full w-full object-cover"
                    onError={() => setImageError(true)} />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 font-medium">
                    {fallback}
                </div>
            )}
        </div>
    );
}
