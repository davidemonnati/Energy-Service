import { Consumption } from '../entities/consumption.entity';

export class ApartmentDTO {
    readonly id!: number;
    readonly number!: string;
    readonly row!: string;
    readonly description!: string;
    readonly consumptions!: Consumption[];
}