import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouter } from './dashboard.router';

@NgModule({
    imports: [
        DashboardRouter,
        CommonModule,
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule { }