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
    width: number;
    height: number;
    speed: number;
    direction: number;
    score: number;
};

type WallType = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type CoinType = {
    id: number;
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
            console.log(data);
            if (data.cars){
                const dataCars = data.cars;
                setMyCar(data.playerCar);
                setCars(dataCars);
                setWalls(data.walls);
                setCoins(data.coins);
            }else if (data.eventType){
                if (data.eventType === 'movement') {
                    const newCar = {
                        id: data.eventData.carId,
                        x: data.eventData.newX,
                        y: data.eventData.newY,
                        speed: data.eventData.speed ?? 0,
                        direction: data.eventData.direction ?? 0,
                        height: data.eventData.height ?? 0,
                        width: data.eventData.width ?? 0,
                        score: data.newScore,
                    };

                    setCars(prevCars => {
                        const newCars = prevCars.filter(car => car.id !== newCar.id);
                        return [...newCars, newCar];
                    });

                } else if (data.eventType === 'coinCollection') {
                    const newCoin = {
                        id: data.eventData.id,
                        x: data.eventData.x ?? 0,
                        y: data.eventData.y ?? 0,
                        collected: true,
                    };
                    setCoins(prevCoins => {
                        const newCoins = prevCoins.filter(coin => coin.id !== newCoin.id);
                        return [...newCoins, newCoin];
                    });

                }
            }else if (data.error){
                console.log(data.error);
            }else {
                console.log("data non recon",data);
            }
        };

        webSocketService.connect('ws://localhost:8080/game', handleGameData);

        return () => {
            webSocketService.disconnect();
        };
    }, []);

    // Dans GameBoard.tsx
    useEffect(() => {
        console.log("cars updated:", cars);
    }, [cars]); // Cette fonction s'exécutera après que `cars` a été mis à jour.

    useEffect(() => {
        console.log("Coin updated:", coins);
    }, [coins]); // Cette fonction s'exécutera après que `cars` a été mis à jour.

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
