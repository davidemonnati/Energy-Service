import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphService } from 'src/app/providers/graph/graph.service';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { CompareService } from 'src/app/providers/compare/compare.service';

@Component({
  selector: 'app-graphscompare',
  templateUrl: './graphscompare.component.html',
  styleUrls: ['./graphscompare.component.css']
})
export class GraphscompareComponent implements OnInit {
  firstApp: string;
  secondApp: string;

  private sub: any;
  public dateInterval1 = new FormControl(new Date());
  public dateInterval2 = new FormControl(new Date());
  private url1: string;
  private url2: string;

  public dateSingle = new FormControl(new Date());
  public startdate = new FormControl(new Date());
  public enddate = new FormControl(new Date());

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private graphService: GraphService,
    private compareService: CompareService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.firstApp = params['valuefirst'];
      this.secondApp = params['valuesecond'];
   });
   this.url1 = environment.BACKEND_ADDR + '/apartments/' + this.firstApp + '/consumptions/';
   this.url2 = environment.BACKEND_ADDR + '/apartments/' + this.secondApp + '/consumptions/';
   this.showGraph(this.url1, this.url2);
  }

  selectDate(): void {
    const urlArray = this.compareService.selectDate(this.dateSingle, this.url1, this.url2);
    this.showGraph(urlArray[0], urlArray[1]);
  }

  selectRangeDate(): void {
    const urlArray = this.compareService.selectRangeDate(this.startdate, this.enddate, this.url1, this.url2);
    this.showGraph(urlArray[0], urlArray[1]);
  }

  showGraph(url1: string, url2: string): void {
    this.zone.runOutsideAngular(() => {
      this.graphService.getChart(url1, url2);
    });
  }
}
