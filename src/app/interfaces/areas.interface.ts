export interface AreaInterface {
    customerId: string; //Required
    room: number; // Required
    roomName: string; // Required
    craft: string; // Required
    area: string; // Required
    price: number; //Required
    direction: string; //Required
    type: string; //Required
    // SF: number; //Required
    cantidad: number; // Es el SF
    disposal: number; //Required
    totalCantidad: number; //Required Es el TotalSQFt
    bidden: number; //Required
    total: number; //Required

    //Extra properties
    unidadUsa: string;
    unidadMx: string;
    cantidadUsa: number;
    cantidadMx: number;
    _id?:string;
}