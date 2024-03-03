'use client'
// src/components/Wall.tsx
import React from 'react';

type WallProps = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const Wall: React.FC<WallProps> = ({ x, y,width,height }) => {
    return (
        <div style={{ position: 'absolute', left: `${x}px`, top: `${y}px`, backgroundColor: 'gray', width: `${width}px`, height: `${height}px` }}>
            {/* Représentation visuelle du mur */}
        </div>
    );
};

export default Wall;
