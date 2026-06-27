import React from 'react';

export const Spinner: React.FC<{ large?: boolean }> = ({ large = false }) => {
    const sizeClasses = large ? 'w-12 h-12' : 'w-5 h-5';
    const borderClasses = large ? 'border-4' : 'border-2';

    return (
        <div 
            className={`${sizeClasses} ${borderClasses} border-t-transparent border-solid animate-spin rounded-full border-cyan-400`}
            role="status"
        >
        </div>
    );
};