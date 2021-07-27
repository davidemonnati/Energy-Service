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
  private comparison;

  constructor(
    private consumptionService: ConsumptionsService
  ) { }

  private createAxisAndSeries(datetime: string, value: string, color: string, seriesName: string) {
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    let series = new am4charts.LineSeries();
    series.name = seriesName;
    series.dataFields.dateX = datetime;
    series.dataFields.valueY = value;
    series.fill = am4core.color(color);
    series.showOnInit = false;

    series.tooltipText = '{' + datetime + '}: [bold]{valueY.value}';
    series = this.chart.series.push(series);
  }

  private createSecondLine(url2: string){
    console.log(url2);
    this.consumptionService.getConsumption(url2)
    .subscribe( data => {
      const changedKey = data.map(({ id, datetime:datetime2, value:value2 }) => ({
        id,
        datetime2,
        value2
      }));

      this.chart.addData(changedKey);
    });
    this.createAxisAndSeries('datetime2', 'value2', 'red', this.splitString(url2));
  }

  getChart(url: string, url2?: string): any {

    if(url2 !== undefined)
      this.comparison = true;

    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.paddingRight = 20;
    this.chart.dateFormatter.inputDateFormat = 'yyyy-MMM-dd HH:mm:ss';

    this.consumptionService.getConsumption(url)
    .subscribe( data => {
      this.chart.data = data;
    });

    this.chart.dataSource.parser = new am4core.JSONParser();

    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.adapter.add('getTooltipText', function(text, target) {
      return '';
    });

    if(this.comparison)
      this.createSecondLine(url2);

    this.createAxisAndSeries('datetime', 'value', 'green', this.splitString(url));

    const scrollbarX = new am4charts.XYChartScrollbar();
    this.chart.scrollbarX = scrollbarX;

    const scrollbarY = new am4charts.XYChartScrollbar();
    this.chart.scrollbarY = scrollbarY;

    this.chart.legend = new am4charts.Legend();

    this.chart.cursor = new am4charts.XYCursor();
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.filePrefix = 'data';

    return this.chart;
  }

  private splitString(url: string): string {
    var splittedString = url.split('/');
    var appName = splittedString[4] + '/' + splittedString[5];
    return appName;
  }
}
