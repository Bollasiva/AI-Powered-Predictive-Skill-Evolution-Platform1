import React from 'react';

interface SkeletonProps {
    type: 'title' | 'text';
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ type, style }) => {
    const classes = `shimmer skeleton-${type}`;
    return <div className={classes} style={style}></div>;
};

export const CardSkeleton: React.FC = () => (
    <div className="recommendation-item glass-card" style={{ opacity: 0.7 }}>
        <Skeleton type="title" />
        <Skeleton type="text" />
        <Skeleton type="text" />
        <div style={{ marginTop: 'auto' }}>
            <Skeleton type="text" style={{ width: '40%' }} />
        </div>
    </div>
);

export default Skeleton;
