'use client'
// src/components/Wall.tsx
import React from 'react';

type WallProps = {
    x: number;
    y: number;
};

const Wall: React.FC<WallProps> = ({ x, y }) => {
    return (
        <div style={{ position: 'absolute', left: `${x}px`, top: `${y}px`, backgroundColor: 'gray', width: '2px', height: '2px' }}>
            {/* Représentation visuelle du mur */}
        </div>
    );
};

export default Wall;
