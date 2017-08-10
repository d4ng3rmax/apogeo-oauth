import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageListComponent } from './../page-list/page-list.component';
import { PagesListService } from './../shared/pages-list.service';
import { Page } from './../shared/models/page.model';
import { SurveyListService } from './../shared/survey-list.service';
import { SurveyPersistService } from './../shared/survey-persist.service';
import { Survey } from './../shared/models/survey.model';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./../page/page.component.scss'],
    providers: [ PagesListService, SurveyListService, SurveyPersistService ]
})
export class SurveyComponent implements OnInit {

    menuEnabled : boolean = false;
    listPath : string = "/survey/list";
    urlId : number;
    surveyTitle: string;
    avaliableItems : Array<any> = [];
    selectedItems : Array<any> = [];
    surveyItems : Survey;

    constructor(
        private route: ActivatedRoute,
        private pagesListService : PagesListService,
        private surveyListService : SurveyListService,
        private surveyPersistService : SurveyPersistService
    ) {
        this.urlId = ( this.route.snapshot.params['id'] ) ? this.route.snapshot.params['id'] : false;
        this.surveyItems = new Survey( 0, "", {}, false );
    }

    async ngOnInit() {

        let avaliableItemsAll = await this.pagesListService.getResult();

        if ( this.urlId ) {
            let serverSurveyItems = await this.surveyListService.getSingleResult( this.urlId );
            this.surveyItems = new Survey( serverSurveyItems.id, serverSurveyItems.title, serverSurveyItems.pageOrder, serverSurveyItems.active );
            this.selectedOnThisSurvey( avaliableItemsAll );
            this.avaliableOnThisSurvey( avaliableItemsAll );
            this.surveyTitle = serverSurveyItems.title;
        } else {
            this.surveyTitle = "";
            this.avaliableItems = avaliableItemsAll;
        }
    }

    moveItem = ( originSelect, from, to ) : void => {

        for ( let i = originSelect.length - 1; i >= 0; i-- ) {

            if ( originSelect[ i ].selected == false )
                continue;

            let page = new Page(
                originSelect[ i ].value,
                originSelect[ i ].text,
                true
            );

            to.push( page );
            from.splice( from.findIndex( q => q.page == page.title && q.id == page.id ), 1 );
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

    moveBottom =( select, arrSelected ) : void => {
        let selectCount = select.length;

        for ( let i = select.length - 1; i >= 0; i-- ) {
            if ( select[ i ].selected == true ) {
                let selectedItem = arrSelected.splice( i, 1 );
                arrSelected.splice( selectCount, 0, selectedItem[ 0 ] );
            }
        }
    }

    avaliableOnThisSurvey =( all ) : void => {

        for ( let prop in this.surveyItems.pageOrder ) {
            all.splice( all.findIndex( q => q.id == this.surveyItems.pageOrder[ prop ].id ), 1 );
        }

        this.avaliableItems = all;
    }

    selectedOnThisSurvey =( all ) : void => {
        for ( let i = 0; i < all.length; i++ ) {
            for ( let prop in this.surveyItems.pageOrder ) {
                if ( all[ i ].id == this.surveyItems.pageOrder[ prop ].id ) {
                    this.selectedItems.push( all[ i ] );
                }
            }
        }
    }

    populatedSurvey =() : Survey => {
        let qo = new Survey( 1, this.surveyTitle, {}, true );

        for ( let i = 0; i < this.selectedItems.length; i++ ) {
            qo.pageOrder[ i + 1 ] = { "id" : this.selectedItems[ i ].id }
        }
        return qo;
    }

    save = () : void => {
        this.surveyPersistService.createData( this.populatedSurvey() );
    }

    update = () : void => {
        this.surveyPersistService.updateData( this.urlId, this.populatedSurvey() );
    }
}
