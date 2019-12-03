import { Apartment } from '../entities/apartment.entity';

export class ConsumptionDTO {
    readonly uuid!: string;
    readonly date !: string;
    readonly time !: string;
    readonly value !: number;
    readonly apartment!: Apartment;
}
