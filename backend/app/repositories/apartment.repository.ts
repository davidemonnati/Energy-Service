import { EntityRepository, AbstractRepository } from "typeorm";
import { Apartment } from "../entities/apartment.entity";

@EntityRepository(Apartment)
export class AreaRepository extends AbstractRepository<Apartment> {

    public async create(apartment: Apartment): Promise<void> {
        await this.repository.save(apartment);
    }

    public async delete(apartment: Apartment): Promise<void> {
        await this.repository.remove(apartment);
    }

    public async getOneByUuid(uuid: string): Promise<Apartment> {
        return await this.repository.findOneOrFail({
            where: {uuid: uuid},
            relations: ['consumptions']
        });
    } 

    public async getAll(): Promise<Apartment[]> {
        return await this.repository.find();
    }
}