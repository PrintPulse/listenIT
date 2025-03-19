export interface RadioStation {
   id: string;
   name: string;
   url: string;
   genre?: string;
   favicon?: string;
};

export interface RadioState {
   currentStation: RadioStation | null;
   stations: RadioStation[];
   isPlaying: boolean;
   volume: number;
};