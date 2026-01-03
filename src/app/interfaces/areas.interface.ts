import { ConsumablesInterface } from "./consumables.interface";
import { MaterialsInterface } from "./materials.interface";

export interface AreaInterface {
    customerId: string; //Required
    projectId: string; //Required
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

export interface BudgetDataInterface {
    // customer data
    customerName: string | undefined;
    companyName: string | undefined;
    number: string | undefined;
    email: string | undefined;
    address: string | undefined;
    // project data
    projectName: string | undefined;
    location: string | undefined;
    startProject: Date | string | undefined;
    endProject: Date | string | undefined;
    // crafts - areas
    areas: AreaInterface[];
    craftsToShow?: string[];
    //materials
    materials: MaterialsInterface[];
    consumables: ConsumablesInterface[];

    /* designOptions?: {
    [craftName: string]: boolean;
    }; */
    // ✅ updated designOptions
    designOptions?: {
        [craftName: string]: {
        enabled: boolean;
        value: number;
        };
    };
  }