import { Component, OnInit } from '@angular/core';
import { ApiCaller } from 'src/app/shared/apiCaller';
import { MatDialog } from '@angular/material/dialog';
import { ControllerNames } from 'src/app/shared/controlerNames';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private apiCaller: ApiCaller,private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar) { 
  }
  ngOnInit(): void {
  }

}
