import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiCaller } from 'src/app/shared/apiCaller';
import { ControllerNames } from 'src/app/shared/controlerNames';

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
  counter: number = 1;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private apiCaller: ApiCaller) {
    Chart.register(...registerables);
    // this.apiCaller.setControllerPath(ControllerNames.Diagram);
  }

  ngOnInit(): void {
    this.initializeForms();
  }

  ngAfterViewInit(): void {
    this.createCharts();
  }

  initializeForms(): void {
    this.charts.push(
      { form: this.createCanvasForm(`canvas-${this.counter}`, 'bar', '#1 Bar', 'Bar', [12, 19, 3, 5, 2], ['Red', 'Blue', 'Yellow', 'Green', 'Orange']) },
      { form: this.createCanvasForm(`canvas-${this.counter + 1}`, 'line', '#2 Line', 'Line', [10, 15, 5, 7, 10], ['January', 'February', 'March', 'April', 'May']) },
      { form: this.createCanvasForm(`canvas-${this.counter + 2}`, 'pie', '#3 Pie', 'Pie', [12, 19, 3, 5, 2], ['Red', 'Blue', 'Yellow', 'Green', 'Orange']) },
      { form: this.createCanvasForm(`canvas-${this.counter + 3}`, 'doughnut', '#4 Doughnut', 'Doughnut', [12, 19, 3, 5, 2], ['Red', 'Blue', 'Yellow', 'Green', 'Orange']) }
    );
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
      chart.form.value.showedConfig = false;
      let data = this.parseArray(chart.form.value.data);
      let labels = this.parseArray(chart.form.value.labels);
      let title = this.parseArray(chart.form.value.title); //todo based on type
      const type = chart.form.value.type;
      this.snackBar.open('Zaktualizowano wykres', 'Zamknij', {
        duration: 2000,
        horizontalPosition: 'center', 
        verticalPosition: 'bottom'
      });
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
  deleteCanvas(chart: any): void {
    const index = this.charts.indexOf(chart);
    if (index !== -1) {
      const canvasElement = this.canvases.toArray()[index];
      if (canvasElement && canvasElement.nativeElement) {
        const existingChart = Chart.getChart(canvasElement.nativeElement);
        if (existingChart) {
          existingChart.destroy();
        }
        this.snackBar.open('Usunięto wykres', 'Zamknij', {
          duration: 5000,
          horizontalPosition: 'center', 
          verticalPosition: 'bottom'
        });
        this.charts.splice(index, 1);
        chart.form.reset();
      }
    }
  }

  createCanvasForm(
    canvas: string,
    type: string = 'bar',
    name: string = '#1',
    title: string = 'Bar',
    data: number[] = [1, 2],
    labels: string[] = ['Red', 'Blue']
  ): FormGroup {
    this.counter++;
    return this.fb.group({
      canvas: [canvas],
      type: [type, Validators.required],
      name: [name, Validators.required],
      title: [title, Validators.required],
      data: [data, Validators.required],
      labels: [labels, Validators.required],
      showedConfig: [false, Validators.required],
    });
  };

  parseArray(input: any): any[] {
    if (typeof input === 'string') {
      return input.split(',').map((item: string) => item.trim());
    }
    return Array.isArray(input) ? input : [];
  }
  
  addNext(): void {
    const newForm = this.createCanvasForm(
      `canvas-${this.counter}`,
      'bar',
      '#2 Barr',
      'Barr',
      [1,2],
      ['Red', 'Blue']
    );
    this.charts.push({ form: newForm });
    setTimeout(()=>{
      this.reloadCanvas({form: newForm}); //fix somehow
    }, 1000)
    this.snackBar.open('Dodano nowy wykres (WIP)', 'Zamknij', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  
}
