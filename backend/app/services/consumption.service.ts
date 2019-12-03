import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ConsumptionRepository } from '../repositories/consumption.repository';
import { ConsumptionDTO } from '../dto/consumption.dto';
import { Consumption } from '../entities/consumption.entity';

Service()
export class ConsumptionService {
    constructor(
        @InjectRepository()
        private readonly consumptionRepository: ConsumptionRepository,
    ) {}

    async create(consumptionDto: ConsumptionDTO): Promise<void> {
        await this.consumptionRepository.create(consumptionDto);
    }

    async delete(uuid: string) {
        await this.consumptionRepository.getOneByUuid(uuid)
        .then((consumption) => this.consumptionRepository.delete(consumption));
    }

    async getOneByUuid(uuid: string): Promise<Consumption> {
        return await this.consumptionRepository.getOneByUuid(uuid);
    }

    async getAll(): Promise<Consumption[]> {
        return await this.consumptionRepository.getAll();
    }
}