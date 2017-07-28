import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { HeaderComponent } from './header/header.component';
import { DataGridComponent } from './shared/data-grid/data-grid.component';
import { PagesComponent } from './pages/pages.component';


@NgModule({
    declarations: [
        AppComponent,
        QuestionComponent,
        QuestionListComponent,
        HeaderComponent,
        DataGridComponent,
        PagesComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgxPaginationModule,
        Ng2SmartTableModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
