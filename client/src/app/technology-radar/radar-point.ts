import {Technology} from './technology/technology';

export interface RadarPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  technology: Technology;
}
