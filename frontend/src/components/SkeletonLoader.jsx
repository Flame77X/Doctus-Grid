import React from 'react';

export const SkeletonLoader = ({ className, height = "h-4", width = "w-full", variant = "text" }) => {
    // variants: text, circle, block
    const baseClasses = "relative overflow-hidden bg-white/10 rounded";

    // Determine shape styles
    let shapeClasses = "";
    if (variant === "circle") {
        shapeClasses = "rounded-full";
    } else {
        shapeClasses = "rounded-lg";
    }

    return (
        <div
            className={`${baseClasses} ${height} ${width} ${shapeClasses} ${className}`}
            style={{
                // Inline styles for the shimmer effect ensuring it works even if Tailwind classes strictly override
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '1000px 100%',
                animation: 'shimmer 2s infinite linear'
            }}
        />
    );
};
