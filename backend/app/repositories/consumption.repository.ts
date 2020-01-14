import { EntityRepository, AbstractRepository } from "typeorm";
import { Consumption } from "../entities/consumption.entity";
import { Apartment } from "../entities/apartment.entity";

@EntityRepository(Consumption)
export class ConsumptionRepository extends AbstractRepository<Consumption> {

    public async create(consumption: Consumption): Promise<void> {
        await this.repository.save(consumption);
    }

    public async delete(consumption: Consumption): Promise<void> {
        await this.repository.remove(consumption);
    }

    public async getOneByid(id: number): Promise<Consumption> {
        return await this.repository.findOneOrFail({
            where: {id: id},
            relations: ['apartment'],
        });
    }

    public async getAll(): Promise<Consumption[]> {
        return await this.repository.find();
    }
}