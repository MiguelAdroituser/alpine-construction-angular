export interface Craft {
    name: string; // Required
    area: string; // Required
    price: number; // Required
    Dimensions?: string; // Optional: tamano de instalacion
    materialUsed?: string; // Optional: materiales que se utilizaran
    leadTime?: string; // Optional: duración del proyecto
    description: string; // Required
  }