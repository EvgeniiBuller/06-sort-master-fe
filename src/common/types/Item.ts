
import type { Container } from './Container'; 

export interface Item {
  id: number;
  name: string;
  type: string;        
  description: string; 
  containerId: number | null; 
  container?: Container | null; 
}