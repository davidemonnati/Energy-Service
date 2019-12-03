"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var apartment_entity_1 = require("./apartment.entity");
var Consumption = /** @class */ (function () {
    function Consumption(uuid, date, time, value, apartment) {
        this.uuid = uuid;
        this.date = date;
        this.time = time;
        this.value = value;
        this.apartment = apartment;
    }
    __decorate([
        typeorm_1.PrimaryColumn('uuid')
    ], Consumption.prototype, "uuid", void 0);
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 150 })
    ], Consumption.prototype, "date", void 0);
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 150 })
    ], Consumption.prototype, "time", void 0);
    __decorate([
        typeorm_1.Column()
    ], Consumption.prototype, "value", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return apartment_entity_1.Apartment; }, function (apartments) { return apartments.consumptions; }, { nullable: false, onDelete: "CASCADE" })
    ], Consumption.prototype, "apartment", void 0);
    Consumption = __decorate([
        typeorm_1.Entity("Consumption")
    ], Consumption);
    return Consumption;
}());
exports.Consumption = Consumption;
