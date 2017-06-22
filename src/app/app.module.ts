// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// main module
import { AppComponent } from './app.component';

// kentico cloud
import { DeliveryClient } from '../../lib';
import { DeliveryClientProvider } from './setup/delivery-client.provider';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // default routes
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/', pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: '/'
      }
    ]),

    // angular modules
    BrowserModule
  ],
  providers: [
    DeliveryClientProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
