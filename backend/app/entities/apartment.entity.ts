import { Entity, Column, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import {Consumption} from "./consumption.entity";

@Entity("Apartment")
@Unique(['row', 'number'])
export class Apartment {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 150, nullable: false})
    public number: string;

    @Column({type: 'varchar', length: 150, nullable: false})
    public row: string;

    @Column({type: 'text', nullable: true })
    public description: string;

    @OneToMany(type => Consumption, consumption => consumption.apartment)
    public consumptions: Consumption[];


    constructor(id: number, number: string, description: string, row: string, consuptions:Consumption[]){
        this.id = id;
        this.number = number;
        this.row = row;
        this.description = description;
        this.consumptions = consuptions;
    }
}