import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SelectableComponent } from '../selectable/selectable.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'selectable', component: SelectableComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
