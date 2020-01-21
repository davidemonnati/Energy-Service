import {Entity, ManyToOne, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import {Apartment} from "./apartment.entity";

@Entity("Consumption")
export class Consumption {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 150})
    public date: string;

    @Column({type: 'varchar', length: 150})
    public time: string;

    @Column()
    public value: number;

    @ManyToOne(type => Apartment, apartments => apartments.consumptions, {nullable: false, onDelete: "CASCADE"})
    public apartment: Apartment;

    constructor(id: number, date: string, time: string, value: number, apartment: Apartment){
        this.id = id;
        this.date = date;
        this.time = time;
        this.value = value;
        this.apartment = apartment;
    }
}