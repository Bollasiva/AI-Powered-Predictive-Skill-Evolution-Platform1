import React from 'react';

const Skeleton = ({ type }) => {
    const classes = `shimmer skeleton-${type}`;
    return <div className={classes}></div>;
};

export const CardSkeleton = () => (
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
