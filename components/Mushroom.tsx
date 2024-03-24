'use client'
// src/components/Mushroom.tsx
import React from 'react';

type MushroomProps = {
    x: number;
    y: number;
    collected: boolean;
};

const Mushroom: React.FC<MushroomProps> = ({ x, y, collected }) => {
    if (collected) {
        return null;
    }
    return (
        <div style={{position: 'absolute', left: `${x}px`, top: `${y}px`}}>
            {/* Ici, vous pouvez ajouter une image ou un style pour représenter la voiture */}
            🍄
        </div>
    )
        ;
};

export default Mushroom;
