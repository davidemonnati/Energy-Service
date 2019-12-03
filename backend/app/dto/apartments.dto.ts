import { Consumption } from '../entities/consumption.entity';

export class ApartmentDTO {
    readonly uuid!: string;
    readonly number!: string;
    readonly row!: string;
    readonly description!: string;
    readonly consumptions!: Consumption[];
}