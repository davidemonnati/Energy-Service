import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApartmentRepository } from '../repositories/apartment.repository';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentDTO } from '../dto/apartments.dto';

Service()
export class ApartmentService {
    constructor(
        @InjectRepository()
        private readonly apartmentRepository: ApartmentRepository,
    ) {}

    async create(apartmentDto: ApartmentDTO): Promise<void> {
        await this.apartmentRepository.create(apartmentDto);
    }

    async delete(uuid: string) {
        await this.apartmentRepository.getOneByUuid(uuid)
        .then((apartment) => this.apartmentRepository.delete(apartment));
    }

    async getOneByUuid(uuid: string): Promise<Apartment> {
        return await this.apartmentRepository.getOneByUuid(uuid);
    }

    async getAll(): Promise<Apartment[]> {
        return await this.apartmentRepository.getAll();
    }
}
