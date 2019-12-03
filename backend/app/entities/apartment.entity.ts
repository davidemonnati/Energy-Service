import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import {Consumption} from "./consumption.entity";

@Entity("Apartment")
export class Apartment {
    @PrimaryColumn('uuid')
    public uuid: string;

    @Column({type: 'varchar', length: 150})
    public number: string;

    @Column({type: 'varchar', length: 150})
    public row: string;

    @Column({type: 'text', nullable: true })
    public description: string;

    @OneToMany(type => Consumption, consumptions => consumptions.apartments)
    public consumptions: Consumption[];


    constructor(uuid: string, number: string, description: string, row: string, consuptions:Consuption[]){
        this.uuid = uuid;
        this.number = number;
        this.row = row;
        this.description = description;
        this.consumptions = consuptions;
    }
}