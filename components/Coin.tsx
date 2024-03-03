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
        <div style={{ position: 'absolute', left: `${x}px`, top: `${y}px`, color: collected ? 'gray' : 'gold' }}>
            {/* Ici, vous pouvez ajouter une icône ou un style pour représenter la pièce */}
            💰
        </div>
    );
};

export default Coin;
