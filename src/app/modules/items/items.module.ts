import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetItemsComponent } from './get-items.component';
import { ItemsRouter } from './items.router';

@NgModule({
    imports: [
        ItemsRouter,
        CommonModule,
    ],
    declarations: [
        GetItemsComponent,
    ]
})
export class ItemsModule { }