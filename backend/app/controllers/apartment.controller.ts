import { Request } from 'express'
import { JsonController, Post, OnUndefined, Body, Req, Delete, Param, Get, BadRequestError, NotFoundError, Authorized } from 'routing-controllers';
import { ApartmentDTO } from '../dto/apartments.dto';
import { LogsUtil } from '../utils/logs.util';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentService } from '../services/apartment.service';
import { Consumption } from '../entities/consumption.entity';


@JsonController('/apartments')
export class ApartmentController {
    constructor(private readonly apartmentService: ApartmentService) {}

    @Authorized()
    @Post()
    @OnUndefined(201)
    async create(@Body() apartmentDto: ApartmentDTO, @Req() req: Request): Promise<void> {
        LogsUtil.logRequest(req);
        await this.apartmentService.create(apartmentDto)
        .catch(() => {
            throw new BadRequestError("Error during apartment creation.");
        })
    }

    @Authorized()
    @Delete('/:id')
    @OnUndefined(201)
    async delete(@Param('id') id: number, @Req() req: Request) {
        LogsUtil.logRequest(req);
        await this.apartmentService.delete(id)
        .catch(() => {
            throw new BadRequestError();
        })
    }

    @Authorized()
    @Get('/:id')
    @OnUndefined(404)
    async getOneByid(@Param('id') id: number, @Req() req: Request): Promise<Apartment> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getOneByid(id)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Authorized()
    @Get('/:row/:number')
    @OnUndefined(404)
    async getApartment(@Param('row') row: string, @Param('number') number: string, @Req() req: Request): Promise<Apartment> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getApartment(row,number)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Authorized()
    @Get('/:id/consumptions')
    @OnUndefined(404)
    async getConsumptionsByApartmentid(@Param('id') id: number, @Req() req: Request): Promise<Consumption[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getConsumptionsOfApartmentid(id)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Authorized()
    @Get('/:row/:number/consumptions')
    @OnUndefined(404)
    async getConsumptionsByApartmentName(@Param('row') row: string, @Param('number') number: string, @Req() req: Request): Promise<Consumption[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getConsumptionsOfApartmentName(row,number)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Authorized()
    @Get('/:row/:number/consumptions/:year/:mounth/:day')
    @OnUndefined(404)
    async getConsumptionsByDate(@Param('row') row: string, @Param('number') number: string, @Param('year') year: string, @Param('mounth') mounth: string, 
        @Param('day') day: string, @Req() req: Request): Promise<Consumption[]> {
            return await this.apartmentService.getConsumptionsByDate(row, number, year, mounth, day);
    }

    @Authorized()
    @Get('/:row/:number/consumptions/:year/:mounth/:day/:year1/:mounth1/:day1')
    @OnUndefined(404)
    async getConsumptionsByRangeDates(@Param('row') row: string, @Param('number') number: string, @Param('year') year: string, @Param('mounth') mounth: string, 
        @Param('day') day: string,@Param('year1') year2: string, @Param('mounth1') mounth2: string, 
        @Param('day1') day2: string, @Req() req: Request): Promise<Consumption[]> {
            return await this.apartmentService.getConsumptionsByRangeDates(row, number,day,mounth,year,day2,mounth2,year2);
    }

    @Authorized()
    @Get()
    @OnUndefined(404)
    async getAll(@Req() req: Request): Promise<Apartment[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getAll()
        .catch(() => {
            throw new NotFoundError();
        })
    }
}