// src/services/WebSocketService.ts
class WebSocketService {
    private ws: WebSocket | null = null;

    connect(url: string, onMessage: (data: any) => void) {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            // Vous pouvez envoyer un message au serveur ici si nécessaire
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        this.ws.onerror = (event) => {
            console.error('WebSocket error', event);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            // Tentative de reconnexion ou gestion de la déconnexion
        };
    }

    sendMessage(message: string) {
        if (this.ws) {
            this.ws.send(message);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const webSocketService = new WebSocketService();
