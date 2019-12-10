import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApartmentRepository } from '../repositories/apartment.repository';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentDTO } from '../dto/apartments.dto';
import { ConsumptionDTO } from '../dto/consumption.dto';
import { Consumption } from '../entities/consumption.entity';
import { ConsumptionService } from './consumption.service';

Service()
export class ApartmentService {
    constructor(
        @InjectRepository()
        private readonly apartmentRepository: ApartmentRepository,
        private readonly consumptionRepository: ConsumptionService,
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

    async getApartment(row: string, number: string): Promise<Apartment> {
        return await this.apartmentRepository.getApartment(row, number);
    }

    public async getConsumptionsOfApartmentUuid(apartmentUuid: string): Promise<Consumption[]> {
        let apartment = await this.apartmentRepository.getOneByUuid(apartmentUuid);
        let consumptions:Consumption[] = new Array();
        for(let consumption of apartment.consumptions)
        {
            const consumptionsOfApartment = await this.consumptionRepository.getOneByUuid(consumption.uuid);
            consumptions.push(consumptionsOfApartment);
        }
        return await consumptions;
    }

    public async getConsumptionsOfApartmentName(row: string, number: string): Promise<Consumption[]> {
        let apartment = await this.apartmentRepository.getApartment(row, number);
        let consumptions:Consumption[] = new Array();
        for(let consumption of apartment.consumptions)
        {
            const consumptionsOfApartment = await this.consumptionRepository.getOneByUuid(consumption.uuid);
            consumptions.push(consumptionsOfApartment);
        }
        return await consumptions;
    }

    async getAll(): Promise<Apartment[]> {
        return await this.apartmentRepository.getAll();
    }
}
