export interface IRadioItem {
   id: number;
   name: string;
   source: string;
};

export interface ISnackbarMsg {
   type: "error" | "success" | null;
   message: string;
}