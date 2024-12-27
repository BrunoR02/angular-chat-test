import { Component, OnInit, ViewChild } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from "ng-apexcharts";
import { map } from "rxjs/operators";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  private getData() {
    return this.http
      .post<>(
        "https://api.radiomemory.com.br/sistemasdev/idoc/log",
        {
          action: "report",
          details: {
            context: "patient",
            action: "insert",
            actionDetail: "drag",
            object: "image",
            status: "info",
            frequency: "daily",
            period: {
              from: "2024-12-01",
              to: "2024-12-27",
            },
          },
        },
        {
          headers: new HttpHeaders({
            Authorization:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9pZG9jLnJhZGlvbWVtb3J5LmNvbS5iciIsImF1ZCI6Imh0dHA6XC9cL2lkb2MucmFkaW9tZW1vcnkuY29tLmJyIiwiaWF0IjoxNzM1MzE4OTQ0LCJleHAiOjE3MzUzMzMzNDQsImRhdGEiOnsidXNlcl9pZCI6MTc0MTkwNjQsInR5cGVfaWQiOjEsInNlcnZpY2UiOiJpZG9jIiwiZW52aXJvbm1lbnQiOiJkZXYifX0.2o9XAWty6UBvrFzQ0mWe5I3EEjqEtEu_XD8nlcRQPJE",
          }),
        }
      )
      .pipe(map((response) => response.data));
  }

  ngOnInit(): void {
    this.getData().subscribe((data) => {
      this.chartOptions = {
        series: data.datasets.map((dataset) => {
          return {
            name: dataset.description,
            data: dataset.results.map((result) => result.value),
          };
        }),
        chart: {
          height: 350,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: data.title,
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: data.datasets[0].results.map((result) => result.label),
        },
      };
    });
  }

  constructor(private http: HttpClient) {}
}
