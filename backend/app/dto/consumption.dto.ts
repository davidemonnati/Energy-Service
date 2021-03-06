import { Apartment } from '../entities/apartment.entity';

export class ConsumptionDTO {
    readonly id!: number;
    readonly datetime !: string;
    readonly value !: number;
    readonly apartment!: Apartment;
}
