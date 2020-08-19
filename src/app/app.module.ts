import {NgModule, Provider} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {AppRoutingModule} from './app-routing.module'
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {ServiceWorkerModule} from '@angular/service-worker'

import {environment} from '../environments/environment'
import {HTTP_INTERCEPTORS} from "@angular/common/http"
import {AuthInterceptor} from "./shared/auth.interceptor"
import {SharedModule} from "./shared/shared.module"
import {AppComponent} from './app.component'
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component'
import {HomePageComponent} from './home-page/home-page.component'
import {PostPageComponent} from './post-page/post-page.component'
import {PostComponent} from './shared/components/post/post.component'

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    PostPageComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    INTERCEPTOR_PROVIDER
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
