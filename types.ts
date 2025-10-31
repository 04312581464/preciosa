export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  storage: number;
  temp: number;
  battery: number;
}
