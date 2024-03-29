'use client'
// src/components/Coin.tsx
import React from 'react';

type CoinProps = {
    x: number;
    y: number;
    collected: boolean;
};

const Coin: React.FC<CoinProps> = ({ x, y, collected }) => {
    if (collected) {
        return null;
    }
    return (
        <div style={{position: 'absolute', left: `${x}px`, top: `${y}px`}}>
            {/* Ici, vous pouvez ajouter une image ou un style pour représenter la voiture */}
                💰
        </div>
    )
        ;
};

export default Coin;
