'use client'
// src/components/Car.tsx
import React from 'react';

type CarProps = {
    id: string;
    x: number;
    y: number;
    speed: number;
    direction: number;
    score: number;
};

const Car: React.FC<CarProps> = ({ x, y }) => {
    return (
        <div style={{ position: 'absolute', left: `${x}px`, top: `${y}px` }}>
            {/* Ici, vous pouvez ajouter une image ou un style pour représenter la voiture */}
            🚗
        </div>
    );
};

export default Car;
