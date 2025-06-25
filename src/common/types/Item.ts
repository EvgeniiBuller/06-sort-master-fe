

export interface Container {
    id: number;
    name: string;
    color: string; 
    description: string;
}

export interface Item {
    id: number; 
    name: string;
    container: Container | null; 
}