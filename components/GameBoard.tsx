'use client'
import React, { useState, useEffect } from 'react';
import Car from './Car';
import Wall from './Wall';
import Coin from './Coin';
import {webSocketService} from "@/utils/WebSocketService";

// Définition des types pour vos données
type CarType = {
    id: string;
    x: number;
    y: number;
    speed: number;
    direction: number;
    score: number;
};

type WallType = {
    x: number;
    y: number;
};

type CoinType = {
    x: number;
    y: number;
    collected: boolean;
};



const GameBoard: React.FC = () => {
    const [myCar, setMyCar] = useState<CarType | null>(null); // Remplacez par le type de votre voiture
    const [cars, setCars] = useState<CarType[]>([]);
    const [walls, setWalls] = useState<WallType[]>([]);
    const [coins, setCoins] = useState<CoinType[]>([]);

    // Ici, vous initialiserez la connexion WebSocket et mettrez à jour l'état avec les données reçues
    // Cette logique sera ajoutée dans les prochaines étapes
    useEffect(() => {
        const handleGameData = (data: any) => {
            // Vérifie si la réponse contient les informations nécessaires pour une voiture
            if (data.cars && data.walls && data.coins) {
                // Mise à jour de l'état avec les données reçues
                setCars(data.cars);
                setWalls(data.walls);
                setCoins(data.coins);
                setMyCar(data.playerCar); // Remplacez par le nom de votre voiture (si nécessaire
            } else if (data.carId && (data.newX !== undefined) && (data.newY !== undefined)) {
                // Mise à jour de la position et du score d'une voiture spécifique
                setCars((prevCars) => prevCars.map((car) => {
                    if (car.id === data.carId) {
                        return { ...car, x: data.newX, y: data.newY, score: data.newScore };
                    }
                    return car;
                }));
            }
            // Mettez ici à jour d'autres éléments du jeu si nécessaire
        };

        webSocketService.connect('ws://localhost:8080/game', handleGameData);

        return () => {
            webSocketService.disconnect();
        };
    }, []);

    // Dans GameBoard.tsx

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            let direction;
            switch (event.key) {
                case 'ArrowUp':
                    direction = 0;
                    break;
                case 'ArrowRight':
                    direction = 1;
                    break;
                case 'ArrowDown':
                    direction = 2;
                    break;
                case 'ArrowLeft':
                    direction = 3;
                    break;
                default:
                    return; // Quitte la fonction si une autre touche est pressée
            }
            // Supposons que "playerCarId" soit l'ID de la voiture du joueur
            const playerCarId = myCar?.id; // Adaptez selon comment vous déterminez l'ID de la voiture du joueur
            if (playerCarId) {
                console.log(`${playerCarId}:${direction}`)
                webSocketService.sendMessage(`${playerCarId}:${direction}`);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [cars]); // Assurez-vous d'ajouter des dépendances si nécessaire


    return (
        <div>
            <h2>Game Board</h2>
            <div>
                {cars.map((car) => (
                    <Car key={car.id} {...car} />
                ))}
                {walls.map((wall, index) => (
                    <Wall key={index} {...wall} />
                ))}
                {coins.map((coin, index) => (
                    <Coin key={index} {...coin} />
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
