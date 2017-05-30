// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// main module
import { AppComponent } from './app.component';

// main components
import { NotFoundComponent } from './modules/shared/not-found.component';

// kentico cloud
import { DeliveryClient } from '../../index';
import { DeliveryClientProvider } from './setup/delivery-client.provider';

// custom modules
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ItemsModule } from './modules/items/items.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    // default routes
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/dash', pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]),

    // angular modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // Custom modules
    DashboardModule,
    ItemsModule
  ],
  providers: [
    DeliveryClientProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
