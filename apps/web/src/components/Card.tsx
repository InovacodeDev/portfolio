import React from "react";

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    className = "",
    onClick,
    hoverable = true,
    ...props
}) => {
    const baseClasses = "card";
    const hoverClasses = hoverable ? "card-hoverable" : "";
    const clickableClasses = onClick ? "card-clickable" : "";

    const classes = [baseClasses, hoverClasses, clickableClasses, className].filter(Boolean).join(" ");

    const CardContent = () => (
        <>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
            <div className="card-content">{children}</div>
        </>
    );

    if (onClick) {
        return (
            <div
                className={classes}
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        onClick();
                    }
                }}
                {...props}
            >
                <CardContent />
            </div>
        );
    }

    return (
        <div className={classes} {...props}>
            <CardContent />
        </div>
    );
};

export default Card;
