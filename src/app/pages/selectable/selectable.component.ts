import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiCaller } from 'src/app/shared/apiCaller';
import { ControllerNames } from 'src/app/shared/controlerNames';

@Component({
  selector: 'app-selectable',
  templateUrl: './selectable.component.html',
  styleUrls: ['./selectable.component.scss']
})
export class SelectableComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SelectableComponent>,private translate: TranslateService, private dialog: MatDialog, private fb: FormBuilder, private apiCaller: ApiCaller) { 
    this.form = this.fb.group(({
      type: [null, Validators.required],
      title: [null, Validators.required],
      name: [null, Validators.required],
      brand: [null],
      model: [null],
      transmission: [null],
      owner: [null],
      fuelType: [null],
      yearFrom: [null],
      yearTo: [null],
      kmDrivenFrom: [null],
      kmDrivenTo: [null],
    }));
  }
  form: any;
  chartTypes: any[] = [
    { type: 'bar'},
    { type: 'line'},
    { type: 'pie'},
    { type: 'doughnut'},
  ];
  brand: string[] = [];
  fuelType: string[] = [];
  model: string[] = [];
  currModel: string[] = [];
  owner: string[] = [];
  transmission: string[] = [];
  ngOnInit(): void {
    this.apiCaller.setControllerPath(ControllerNames.Data);
    this.apiCaller.getSelectable().subscribe((res:any)=>{
      console.log(res);
      this.brand = res?.brand;
      this.fuelType = res?.fuelType;
      this.model = res?.model;
      this.owner = res?.owner;
      this.transmission = res?.transmission;
    });
    this.form.get('brand')?.valueChanges.subscribe((selectedBrands: string[]) => {
      this.form.get('model').patchValue(null);
      if (selectedBrands && selectedBrands.length > 0) {
        this.currModel = this.model.filter((item: any) => 
          selectedBrands.includes(item.brand)
        ).map((item: any) => item.model).flat();
      } else {
        this.currModel = [];
      }
    });
  }
  onClose(): void {
    console.log("ONCLOSE", this.form.value)
    this.dialogRef.close(this.form.value);
  }
}
