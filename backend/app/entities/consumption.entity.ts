import {Entity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import {Apartment} from "./apartment.entity";

@Entity("Consumption")
export class Consumption {
    @PrimaryColumn('uuid')
    public uuid: string;

    @Column({type: 'varchar', length: 150})
    public date: string;

    @Column({type: 'varchar', length: 150})
    public time: string;

    @Column()
    public value: number;

    @ManyToOne(type => Apartment, apartments => apartments.consumptions, {nullable: false, onDelete: "CASCADE"})
    public apartment: Apartment;

    constructor(uuid: string, date: string, time: string, value: number, apartment: Apartment){
        this.uuid = uuid;
        this.date = date;
        this.time = time;
        this.value = value;
        this.apartment = apartment;
    }
}