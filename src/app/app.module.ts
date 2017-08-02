import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DataGridComponent } from './shared/data-grid/data-grid.component';
import { DataGridPagesComponent } from './shared/data-grid-pages/data-grid.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { PageComponent } from './page/page.component';
import { PageListComponent } from './page-list/page-list.component';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        DataGridComponent,
        DataGridPagesComponent,
        QuestionListComponent,
        PageComponent,
        PageListComponent
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
