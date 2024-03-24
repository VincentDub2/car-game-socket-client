'use client'
import React, { useState, useEffect, useRef } from 'react';
import Car from './Car';
import Wall from './Wall';
import Coin from './Coin';
import Mushrooom from './Mushroom';
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
    const [mushrooms, setMushrooms] = useState<CoinType[]>([]);
    const keyPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const keyPressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [score, setScore] = useState<number>(0);


    const startSendingMessages = (direction: number) => {
        if (keyPressIntervalRef.current !== null) {
            return;
        }

        const playerCarId = myCar?.id; // Adaptez selon comment vous déterminez l'ID de la voiture du joueur
        if (playerCarId) {
            keyPressIntervalRef.current = setInterval(() => {
                console.log(`${playerCarId}:${direction}`);
                webSocketService.sendMessage(`${playerCarId}:${direction}`);
            }, 150);
        }
    };

    const stopSendingMessages = () => {
        if (keyPressIntervalRef.current !== null) {
            clearInterval(keyPressIntervalRef.current);
            keyPressIntervalRef.current = null;
        }
    };

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
                setMushrooms(data.mushrooms);
            }else if (data.eventType){
                if (data.eventType === 'movement') {
                    console.log("Movement",data.eventData);
                    setScore(data.eventData.newScore);
                    const newCar = {
                        id: data.eventData.carId,
                        x: data.eventData.newX,
                        y: data.eventData.newY,
                        speed: data.eventData.speed ?? 0,
                        direction: data.eventData.direction ?? 0,
                        height: data.eventData.height ?? 0,
                        width: data.eventData.width ?? 0,
                        score: data.eventData.newScore,
                    };

                    setCars(prevCars => {
                        const newCars = prevCars.filter(car => car.id !== newCar.id);
                        return [...newCars, newCar];
                    });

                } else if (data.eventType === 'coinCollection') {
                    const newCoin = {
                        id: data.eventData.id,
                        x: data.eventData.x,
                        y: data.eventData.y,
                        collected: true,
                    };
                    setCoins(prevCoins => {
                        const newCoins = prevCoins.filter(coin => coin.id !== newCoin.id);
                        return [...newCoins, newCoin];
                    });

                } else if (data.eventType === 'coinAdd'){
                    const newCoin = {
                        id: data.eventData.id,
                        x: data.eventData.x,
                        y: data.eventData.y,
                        collected: false,
                    };
                    setCoins(prevCoins => {
                        const newCoins = prevCoins.filter(coin => coin.id !== newCoin.id);
                        return [...newCoins, newCoin];
                    });
                }else if (data.eventType === 'MushroomAddEvent'){
                    const newMushroom = {
                        id: data.eventData.id,
                        x: data.eventData.x ?? 0,
                        y: data.eventData.y ?? 0,
                        collected: false,
                    };
                    setMushrooms(prevMushrooms => {
                        const newMushrooms = prevMushrooms.filter(mushroom => mushroom.id !== newMushroom.id);
                        return [...newMushrooms, newMushroom];
                    });
                }else if (data.eventType === 'mushroomCollection'){
                    const newMushroom = {
                        id: data.eventData.id,
                        x: data.eventData.x ?? 0,
                        y: data.eventData.y ?? 0,
                        collected: true,
                    };
                    setMushrooms(prevMushrooms => {
                        const newMushrooms = prevMushrooms.filter(mushroom => mushroom.id !== newMushroom.id);
                        return [...newMushrooms, newMushroom];
                    });
                }
            }else if (data.error){
                console.log(data.error);
            }else {
                console.log("data non recon",data);
            }
        };

        //webSocketService.connect("wss://socket-car-game-jvm-1.onrender.com/game", handleGameData);
        webSocketService.connect("ws://localhost:8080/game", handleGameData);

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
        const handleKeyDown = (event: KeyboardEvent) => {
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

            startSendingMessages(direction);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowRight':
                case 'ArrowDown':
                case 'ArrowLeft':
                    stopSendingMessages();
                    break;
                default:
                    return; // Quitte la fonction si une autre touche est relâchée
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [myCar]);


    return (
        <div className="relative m-2 bg-gray-200 " style={{width: '1000px', height: '800px'}}>
            {/* Score en haut à droite avec Tailwind CSS */}
            <div className="absolute right-0 top-0 m-4 p-2 bg-white bg-opacity-75 rounded shadow-lg text-lg font-bold">
                Score: {score}
            </div>
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
                {mushrooms.map((mushroom, index) => (
                    <Mushrooom key={index} {...mushroom} />
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
