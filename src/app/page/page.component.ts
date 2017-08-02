import { QuestionListComponent } from './../question-list/question-list.component';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { QuestionListService } from './../shared/question-list.service';
import { Question } from './../shared/models/question.model';
import { PagesListService } from './../shared/pages-list.service';
import { Page } from './../shared/models/page.model';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    providers: [ QuestionListService, PagesListService ]
})
export class PageComponent implements OnInit {

    private urlId : number;
    avaliableItems : Array<any> = [];
    selectedItems : Array<any> = [];
    listService : any;
    pageService : any;
    pageItems : Page;

    constructor(
        private route: ActivatedRoute,
        private questionListService : QuestionListService,
        private pagesListService : PagesListService
    ) {
        this.urlId = ( this.route.snapshot.params['id'] ) ? this.route.snapshot.params['id'] : null;
        this.listService = this.questionListService;
        this.pageService = this.pagesListService;
        this.pageItems = new Page( 0, "", {}, false );
    }

    async ngOnInit() {
        this.avaliableItems = await this.listService.getResult();
        let serverPageItems = await this.pageService.getSingleResult( this.urlId );
        this.pageItems = new Page( serverPageItems.id, serverPageItems.title, serverPageItems.active );
    }

    moveItem = ( originSelect, from, to ) : void => {

        for ( let i = originSelect.length - 1; i >= 0; i-- ) {

            if ( originSelect[ i ].selected == false )
                continue;

            let question = new Question(
                originSelect[ i ].value,
                originSelect[ i ].text,
                true
            );

            to.push( question );
            from.splice( from.findIndex( q => q.question == question.question && q.id == question.id ), 1 );
        }
    }

    moveAll = ( from, to ) : void => {
        from.forEach(el => {
            to.push( el );
        });

        from.length = 0;
    }

    moveTop = ( select, arrSelected ) : void => {

        for ( var i = 0; i < select.length; i++ ) {
            if ( select[ i ].selected == true ) {
                let selectedItem = arrSelected.splice( i, 1 );
                arrSelected.splice( 0, 0, selectedItem[ 0 ] );
            }
        }
    }

    moveUp = ( select, arrSelected ) : void => {

        for ( let i = select.length - 1; i >= 0; i-- ) {
            if ( select[ i ].selected != true || i == 0 )
                continue;

            let selectedItem = arrSelected.splice( i, 1 );
            arrSelected.splice( i - 1, 0, selectedItem[ 0 ] );
        }
    }

    moveDown = ( select, arrSelected ) : void => {
        let selectCount = select.length;

        for ( let i = 0; i < select.length; i++ ) {
            if ( select[ i ].selected != true || i == selectCount )
                continue;

            let selectedItem = arrSelected.splice( i, 1 );
            arrSelected.splice( i + 1, 0, selectedItem[ 0 ] );
        }
    }

    moveBottom = ( select, arrSelected ) : void => {
        let selectCount = select.length;

        for ( let i = select.length - 1; i >= 0; i-- ) {
            if ( select[ i ].selected == true ) {
                let selectedItem = arrSelected.splice( i, 1 );
                arrSelected.splice( selectCount, 0, selectedItem[ 0 ] );
            }
        }
    }
}
