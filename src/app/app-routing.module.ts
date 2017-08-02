import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { PageListComponent } from './page-list/page-list.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: '',
                component: QuestionListComponent
            },
            {
                path: 'question/list',
                component: QuestionListComponent,
            },
            {
                path: 'page/list',
                component: PageListComponent,
            },
            {
                path: 'page/:id',
                component: PageComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
