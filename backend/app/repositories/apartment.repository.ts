import { EntityRepository, AbstractRepository } from "typeorm";
import { Apartment } from "../entities/apartment.entity";

@EntityRepository(Apartment)
export class ApartmentRepository extends AbstractRepository<Apartment> {

    public async create(apartment: Apartment): Promise<void> {
        await this.repository.save(apartment);
    }

    public async delete(apartment: Apartment): Promise<void> {
        await this.repository.remove(apartment);
    }

    public async getOneByid(id: number): Promise<Apartment> {
        return await this.repository.findOneOrFail({
            where: {id: id},
            relations: ['consumptions']
        });
    }

    public async getApartment(row: string, number: string): Promise<Apartment> {
        return await this.repository.findOneOrFail({
            where: {row: row} && {number:number},
            relations: ['consumptions']
        });
    }

    public async getAll(): Promise<Apartment[]> {
        return await this.repository.find();
    }
}