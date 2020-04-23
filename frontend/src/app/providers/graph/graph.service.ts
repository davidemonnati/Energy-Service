import { Injectable } from '@angular/core';
import { ConsumptionsService } from '../consumptions/consumptions.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private chart;

  constructor(
    private consumptionService: ConsumptionsService
  ) { }

  initializeGraph(): void {
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.paddingRight = 20;
    this.chart.dateFormatter.inputDateFormat = 'dd/M/yyyy H:m:s';
  }

  loadData(url: string): void {
    this.consumptionService.getConsumption(url)
    .subscribe( data => {
      this.chart.data = data;
    });
    this.chart.dataSource.parser = new am4core.JSONParser();
  }

  setDateAxis(): void {
    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.tooltipDateFormat = 'HH:mm:ss, d MMM yyyy';
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
  }

  setValueAxis(): void {
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
  }

  setScrollbars(series: any): void {
    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;

    const scrollbarY = new am4charts.XYChartScrollbar();
    scrollbarY.series.push(series);
    this.chart.scrollbarY = scrollbarY;
  }

  enableExportMenu(): void {
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.filePrefix = 'data';
  }

  setSeriesData(): any {
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'datetime';
    series.dataFields.valueY = 'value';
    series.showOnInit = false;
    series.tooltipText = '{valueY.value}';
    return series;
  }

  getChart(url: string): any {
    this.initializeGraph();
    this.loadData(url);
    this.setDateAxis();
    this.setValueAxis();

    const series = this.setSeriesData();
    this.chart.cursor = new am4charts.XYCursor();

    this.setScrollbars(series);
    this.enableExportMenu();
    return this.chart;
  }
}
