import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApartmentRepository } from '../repositories/apartment.repository';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentDTO } from '../dto/apartments.dto';
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

    async delete(id: number) {
        await this.apartmentRepository.getOneByid(id)
        .then((apartment) => this.apartmentRepository.delete(apartment));
    }

    async getOneByid(id: number): Promise<Apartment> {
        return await this.apartmentRepository.getOneByid(id);
    }

    async getApartment(row: string, number: string): Promise<Apartment> {
        return await this.apartmentRepository.getApartment(row, number);
    }

    async getConsumptionsOfApartmentid(apartmentid: number): Promise<Consumption[]> {
        let apartment = await this.apartmentRepository.getOneByid(apartmentid);
        let consumptions:Consumption[] = new Array();
        for(let consumption of apartment.consumptions)
        {
            const consumptionsOfApartment = await this.consumptionRepository.getOneByid(consumption.id);
            consumptions.push(consumptionsOfApartment);
        }
        return await consumptions;
    }

    async getConsumptionsOfApartmentName(row: string, number: string): Promise<Consumption[]> {
        let apartment = await this.apartmentRepository.getApartment(row, number);
        let consumptions:Consumption[] = new Array();
        for(let consumption of apartment.consumptions)
        {
            const consumptionsOfApartment = await this.consumptionRepository.getOneByid(consumption.id);
            consumptions.push(consumptionsOfApartment);
        }
        consumptions.sort((a,b) => b.datetime > a.datetime ? -1 : 1);

        return await consumptions;
    }

    async getConsumptionsByDate(row: string, number: string, year: string, mounth: string, day: string): Promise<Consumption[]> {
        let apartment = await this.apartmentRepository.getApartment(row, number);
        let consumptions:Consumption[] = new Array();
        let datetime = this.getDateString(day, mounth, year);
        for(let consumption of apartment.consumptions) {
            const consumptionsOfApartment = await this.consumptionRepository.getOneByid(consumption.id);
            if(consumptionsOfApartment.datetime.includes(datetime)){
                consumptions.push(consumptionsOfApartment);
            }
        }
        consumptions.sort((a,b) => b.datetime > a.datetime ? -1 : 1);

        return await consumptions;
    }

    async getConsumptionsByRangeDates(row: string, number: string, day: string, mounth: string, year: string, day2: string, mounth2: string, year2: string): Promise<Consumption[]> {      
        let apartment = await this.apartmentRepository.getApartment(row, number);
        let consumptions: Consumption[] = new Array();
        let datetime = new Date(year+"/"+mounth+"/"+day);
        let datetime2 = new Date(year2+"/"+mounth2+"/"+day2);
        var dates: Date[] = this.getDateRange(datetime,datetime2);

        for(let i=0; i<dates.length;i++) {
            var dateString = this.getDateString(dates[i].getDate().toString(), (dates[i].getMonth() + 1).toString(),
                dates[i].getFullYear().toString());

            for(let consumption of apartment.consumptions){
                const consumptionsOfApartment = await this.consumptionRepository.getOneByid(consumption.id);
                if(consumptionsOfApartment.datetime.includes(dateString)){
                    consumptions.push(consumptionsOfApartment);
                }
            }
        }
        consumptions.sort((a,b) => b.datetime > a.datetime ? -1 : 1);

        return await consumptions;
    }

    async getAll(): Promise<Apartment[]> {
        return await this.apartmentRepository.getAll();
    }

    private getDateString(day: string, mounth: string, year: string): string {
        day = ('0' + day).slice(-2)
        mounth = ('0' + mounth).slice(-2);
        
        return day + '/' + mounth + '/' + year;
    }

    private getDateRange(startDate: Date, endDate: Date): Date[] {
        let dates:Date[] = new Array();
        let currentDate: Date = startDate;
        while (currentDate <= endDate) {
            dates.push(currentDate);
            let date = new Date(currentDate);
            date.setDate(date.getDate() + 1);
            currentDate = date;
        }
        return dates;
    }
}
