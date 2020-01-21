import { Request } from 'express'
import { JsonController, Post, OnUndefined, Body, Req, Delete, Param, Get, BadRequestError, NotFoundError } from 'routing-controllers';
import { ApartmentDTO } from '../dto/apartments.dto';
import { LogsUtil } from '../utils/logs.util';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentService } from '../services/apartment.service';
import { Consumption } from '../entities/consumption.entity';


@JsonController('/apartments')
export class ApartmentController {
    constructor(private readonly apartmentService: ApartmentService) {}
    @Post()
    @OnUndefined(201)
    async create(@Body() apartmentDto: ApartmentDTO, @Req() req: Request): Promise<void> {
        LogsUtil.logRequest(req);
        await this.apartmentService.create(apartmentDto)
        .catch(() => {
            throw new BadRequestError("Error during apartment creation.");
        })
    }

    @Delete('/:id')
    @OnUndefined(201)
    async delete(@Param('id') id: number, @Req() req: Request) {
        LogsUtil.logRequest(req);
        await this.apartmentService.delete(id)
        .catch(() => {
            throw new BadRequestError();
        })
    }

    @Get('/:id')
    @OnUndefined(404)
    async getOneByid(@Param('id') id: number, @Req() req: Request): Promise<Apartment> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getOneByid(id)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Get('/:row/:number')
    @OnUndefined(404)
    async getApartment(@Param('row') row: string, @Param('number') number: string, @Req() req: Request): Promise<Apartment> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getApartment(row,number)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Get('/:id/consumptions')
    @OnUndefined(404)
    async getConsumptionsByApartmentid(@Param('id') id: number, @Req() req: Request): Promise<Consumption[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getConsumptionsOfApartmentid(id)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Get('/:row/:number/consumptions')
    @OnUndefined(404)
    async getConsumptionsByApartmentName(@Param('row') row: string, @Param('number') number: string, @Req() req: Request): Promise<Consumption[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getConsumptionsOfApartmentName(row,number)
        .catch(() => {
            throw new NotFoundError();
        })
    }

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