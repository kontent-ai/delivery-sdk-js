import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetItemsComponent } from './get-items.component';

const routes: Routes = [
  { path: 'getitems', component: GetItemsComponent }
];

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ItemsRouter { }