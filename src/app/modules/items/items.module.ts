import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetItemsComponent } from './get-items.component';
import { ItemsRouter } from './items.router';

import { MarkdownModule } from 'angular2-markdown';

@NgModule({
    imports: [
        ItemsRouter,
        CommonModule,
        MarkdownModule
    ],
    declarations: [
        GetItemsComponent,
    ]
})
export class ItemsModule { }