import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { CmspageModule } from "./cmspage/cmspage.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { BannerComponent } from "./banner/banner.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

import { SubmissionModule } from "./submission/submission.module";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";

import { httpInterceptorProviders } from "./http-interceptors/index";
import { DndDirective } from "./directives/dnd.directive";

import { HttpModule } from "@angular/http";
import { LanguageSwitcherComponent } from "./language-switcher/language-switcher.component";
import { TranslationService } from "./services/translation.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    PageNotFoundComponent,
    DndDirective,
    LanguageSwitcherComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CmspageModule,
    SubmissionModule,
    AdminModule,
    AuthModule,
    AppRoutingModule,
    HttpModule,
  ],
  providers: [Title, httpInterceptorProviders, TranslationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
