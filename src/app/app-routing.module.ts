import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: '',
                component: AppComponent
            },
            {
                path: 'question/list',
                component: QuestionListComponent,
            },
            {
                path: 'question/:id',
                component: QuestionComponent,
            },
            {
                path: 'pages',
                component: PagesComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
