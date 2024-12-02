import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren('canvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;
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
  charts: any[] = [];
  chartTypes: any[] = [
    { title: "Słupkowy", type: 'bar', description: 'Chart słupkowy (Bar chart) przedstawia dane w postaci prostokątnych słupków o różnej wysokości.' },
    { title: "Liniowy", type: 'line', description: 'Wykres liniowy (Line chart) pokazuje dane jako serię punktów połączonych liniami, co pozwala na zobaczenie trendów.' },
    { title: "Kołowy", type: 'pie', description: 'Wykres kołowy (Pie chart) pokazuje proporcje między kategoriami w postaci wycinków koła.' },
    { title: "Donutowy", type: 'doughnut', description: 'Wykres donutowy (Doughnut chart) jest podobny do wykresu kołowego, ale ma pusty środek, co pozwala na lepsze wizualizowanie danych.' },
  ];
  
  constructor(private fb: FormBuilder) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeForms();
  }

  ngAfterViewInit(): void {
    this.createCharts();
  }

  initializeForms(): void {
    let counter = 1;
    this.charts = [
      { form: this.fb.group({
          canvas: [`canvas-${counter}`],
          type: ['bar', Validators.required],
          name: [`#${counter++} Bar`, Validators.required],
          title: ["Bar", Validators.required],
          data: [[12, 19, 3, 5, 2], Validators.required],
          labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
          showedConfig: [false, Validators.required],
        })
      },
      { form: this.fb.group({
          canvas: [`canvas-${counter}`],
          type: ['bar', Validators.required],
          name: [`#${counter++} Bar`, Validators.required],
          title: ["Bar", Validators.required],
          data: [[12, 19, 3, 5, 2], Validators.required],
          labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
          showedConfig: [false, Validators.required],
        })
      },
      { form: this.fb.group({
          canvas: [`canvas-${counter}`],
          type: ['line', Validators.required],
          name: [`#${counter++} Line`, Validators.required],
          title: ["Line", Validators.required],
          data: [[10, 15, 5, 7, 10], Validators.required],
          labels: [['January', 'February', 'March', 'April', 'May'], Validators.required],
          showedConfig: [false, Validators.required],
        })
      },
      { form: this.fb.group({
          canvas: [`canvas-${counter}`],
          type: ['pie', Validators.required],
          name: [`#${counter++} Pie`, Validators.required],
          title: ["Pie", Validators.required],
          data: [[12, 19, 3, 5, 2], Validators.required],
          labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
          showedConfig: [false, Validators.required],
        })
      },
      { form: this.fb.group({
          canvas: [`canvas-${counter}`],
          type: ['doughnut', Validators.required],
          name: [`#${counter++} Doughnut`, Validators.required],
          title: ["Doughnut", Validators.required],
          data: [[12, 19, 3, 5, 2], Validators.required],
          labels: [['Red', 'Blue', 'Yellow', 'Green', 'Orange'], Validators.required],
          showedConfig: [false, Validators.required],
        })
      },
    ];
  }
  

  switchState(form: FormGroup): void {
    const currentState = form.value.showedConfig;
    form.patchValue({
      showedConfig: !currentState,
    });
  }

  createCharts(): void {
    this.canvases.toArray().forEach((canvasElement, index) => {
      const chart = this.charts[index];
      const data = chart.form.value.data;
      const labels = chart.form.value.labels;
      const title = chart.form.value.title;
      const type = chart.form.value.type;

      new Chart(canvasElement.nativeElement, {
        type: type,
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: this.chartColors,
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
    });
  }
  reloadCanvas(chart: any): void {
    const canvasElement = this.canvases.toArray()[this.charts.indexOf(chart)];
    if (canvasElement && canvasElement.nativeElement) {
      const existingChart = Chart.getChart(canvasElement.nativeElement);
      if (existingChart) {
        existingChart.destroy();
      }
      let data = this.parseArray(chart.form.value.data);
      let labels = this.parseArray(chart.form.value.labels);
      let title = this.parseArray(chart.form.value.title); //todo based on type
      const type = chart.form.value.type;

      new Chart(canvasElement.nativeElement, {
        type: type,
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: this.chartColors,
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
  }
  parseArray(input: any): any[] {
    if (typeof input === 'string') {
      return input.split(',').map((item: string) => item.trim());
    }
    return Array.isArray(input) ? input : [];
  }
  
  addNext(){
    console.log("AddNewItemPlaceholder")
  }
}
