import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('barCanvas', { static: true }) barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas', { static: true }) lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutCanvas', { static: true }) doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  usedDataSet: string = environment.dataSet;
  chartColors: string[] = [
    '#E6F4EA',
    '#C8E6C9',
    '#A8D5BA',
    '#81C784',
    '#6CCF70',
    '#4CAF50',
    '#3B873E',
    '#2D6E31',
    '#1F4F23',
    '#133719',
  ];
  barForm!: FormGroup;
  pieForm!: FormGroup;
  lineForm!: FormGroup;
  doughnutForm!: FormGroup;
  charts=[this.barForm, this.pieForm, this.lineForm, this.doughnutForm];

  constructor(private fb: FormBuilder) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeForms();
    this.createCharts();
  }

  //#region Initialize Forms
  initializeForms(): void {
    this.barForm = this.fb.group({
      canvas: ["barCanvas", Validators.required],
      name: ["#1 Bar", Validators.required],
      title: ["Bar", Validators.required],
      data: [[12, 19, 3, 5, 2], Validators.required],
      labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
      showedConfig: [false, Validators.required],
    });

    this.pieForm = this.fb.group({
      canvas: ["pieCanvas", Validators.required],
      name: ["#2 Pie", Validators.required],
      title: ["Pie", Validators.required],
      data: [[12, 19, 3, 5, 2], Validators.required],
      labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
    });

    this.lineForm = this.fb.group({
      canvas: ["lineCanvas", Validators.required],
      name: ["#3 Line", Validators.required],
      title: ["Line", Validators.required],
      data: [[10, 15, 5, 7, 10], Validators.required],
      labels: [['January', 'February', 'March', 'April', 'May'], Validators.required],
    });

    this.doughnutForm = this.fb.group({
      canvas: ["barCanvas", Validators.required],
      name: ["#4 Doughnut", Validators.required],
      title: ["Doughnut", Validators.required],
      data: [[12, 19, 3, 5, 2], Validators.required],
      labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
    });
  }
  //#endregion

  switchState(form: FormGroup): void {
    const currentState = form.value.showedConfig;
    form.patchValue({
      showedConfig: !currentState
    });
  }

  //#region Create Charts
  createCharts(): void {
    this.createBarChart();
    this.createLineChart();
    this.createPieChart();
    this.createDoughnutChart();
  }
  //#endregion

  //#region Bar
  createBarChart(): void {
    const data = this.barForm.value.data;
    const labels = this.barForm.value.labels;
    const title = this.barForm.value.title;

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor: this.chartColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });
  }
  //#endregion

  //#region Line
  createLineChart(): void {
    const data = this.lineForm.value.data;
    const labels = this.lineForm.value.labels;
    const title = this.doughnutForm.value.title;

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            borderColor: this.chartColors[1],
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });
  }
  //#endregion

  //#region Pie
  createPieChart(): void {
    const data = this.pieForm.value.data;
    const labels = this.pieForm.value.labels;
    const title = this.pieForm.value.title;

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: this.chartColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }
  //#endregion

  //#region Doughnut
  createDoughnutChart(): void {
    const data = this.doughnutForm.value.data;
    const labels = this.doughnutForm.value.labels;
    const title = this.doughnutForm.value.title;

    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: this.chartColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }
  //#endregion
}
