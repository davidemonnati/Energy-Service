import { Apartment } from './apartments';

export class Consumptions {
    id: number;
    datetime: string;
    value: number;
    apartment: Apartment;
}