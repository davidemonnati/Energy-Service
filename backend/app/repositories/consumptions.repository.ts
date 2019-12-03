import { EntityRepository, AbstractRepository } from "typeorm";
import { Consumption } from "../entities/consumption.entity";

@EntityRepository(Consumption)
export class ConsumptionRepository extends AbstractRepository<Consumption> {

    public async create(consumption: Consumption): Promise<void> {
        await this.repository.save(consumption);
    }

    public async delete(consumption: Consumption): Promise<void> {
        await this.repository.remove(consumption);
    }

    public async getOneByUuid(uuid: string): Promise<Consumption> {
        return await this.repository.findOneOrFail({
            where: {uuid: uuid},
            relations: ['apartment'],
        });
    }

    public async getAll(): Promise<Consumption[]> {
        return await this.repository.find();
    }
}