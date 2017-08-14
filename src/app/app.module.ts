import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PersistNavigationComponent } from './shared/partials/persist-navigation/persist-navigation.component';
import { DataGridComponent } from './shared/data-grid/data-grid.component';
import { DataGridPagesComponent } from './shared/data-grid-pages/data-grid.component';
import { DataGridSurveyComponent } from './shared/data-grid-survey/data-grid.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { PageComponent } from './page/page.component';
import { PageListComponent } from './page-list/page-list.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { CreateModalComponent } from './shared/partials/create-modal.component';
import { EditModalComponent } from './shared/partials/edit-modal.component';
import { CheckboxComponent } from './shared/partials/custom-render/checkbox/checkbox.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        DataGridComponent,
        DataGridPagesComponent,
        DataGridSurveyComponent,
        QuestionListComponent,
        PageComponent,
        PageListComponent,
        SurveyComponent,
        SurveyListComponent,
        CreateModalComponent,
        EditModalComponent,
        PersistNavigationComponent,
        CheckboxComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NgxPaginationModule,
        Ng2SmartTableModule,
        AppRoutingModule,
        Ng2Bs3ModalModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [CheckboxComponent]
})
export class AppModule { }
