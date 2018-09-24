import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AngularHttpService } from './angular-http.service';

@NgModule({
    providers: [
        AngularHttpService
    ],
    imports: [
        HttpClientModule
    ]
})
export class AngularHttpServiceModule {
}
