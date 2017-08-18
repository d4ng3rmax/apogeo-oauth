import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageListComponent } from './../page-list/page-list.component';
import { SurveyService } from './../shared/survey.service';
import { PageService } from './../shared/page.service';
import { Page } from './../shared/models/page.model';
import { Survey } from './../shared/models/survey.model';
import { Alert } from './../shared/models/alert.model';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./../page/page.component.scss'],
    providers: [ SurveyService, PageService ]
})
export class SurveyComponent implements OnInit {

    menuEnabled : boolean = false;
    listPath : string = "/survey/list";
    urlId : number;
    surveyTitle: string;
    surveyActive : boolean;
    avaliableItems : Array<any> = [];
    selectedItems : Array<any> = [];
    surveyItems : Survey;
    alert : Alert;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service : SurveyService,
        private pagesListService : PageService
    ) {
        this.urlId = ( this.route.snapshot.params['id'] ) ? this.route.snapshot.params['id'] : false;
        this.surveyItems = new Survey( 0, "", {}, false );
        this.alert = new Alert( 0, "Title", "Message", "cssClass", false );
    }

    async ngOnInit() {

        let avaliableItemsAll = await this.pagesListService.getResult();

        if ( this.urlId ) {
            let serverSurveyItems = await this.service.getSingleResult( this.urlId );
            this.surveyItems = new Survey( serverSurveyItems.id, serverSurveyItems.title, serverSurveyItems.pageOrder, serverSurveyItems.active );
            this.selectedOnThisSurvey( avaliableItemsAll );
            this.avaliableOnThisSurvey( avaliableItemsAll );
            this.surveyTitle = serverSurveyItems.title;
            this.surveyActive = serverSurveyItems.active;
        } else {
            this.surveyTitle = "";
            this.surveyActive = true;
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
        for ( let prop in this.surveyItems.pageOrder ) {
            for ( let i = 0; i < all.length; i++ ) {
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

    save =( event ) : void => {
        this.service.createData( this.populatedSurvey() )
            .then( data => {
                this.buildAlert( 1, "Questionário criado com sucesso!" );

                setTimeout( ()=> {
                    this.router.navigate( ['/survey/list' ] );
                }, 2000);

            }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    }

    update =( event ) : void => {
        this.service.updateData( this.urlId, this.populatedSurvey() )
            .then( data => {
                this.buildAlert( 1, "Questionário atualizado com sucesso!" );

            }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    }

    delete =( event ) => {
        if ( window.confirm( 'Deseja mesmo excluir esse questionário?' ) ) {
            this.service.deleteData( this.urlId )
                .then( data => {
                    this.buildAlert( 1, "Pergunta excluida com sucesso!" );

                    setTimeout( ()=> {
                        this.router.navigate( ['/survey/list' ] );
                    }, 2000);
                }, error => {
                    this.buildAlert( 0, JSON.parse( error._body ).errorMessage );
                });
                
        } else {
            return;
        }
    }

    setStatus = ( status : boolean ) : void => {
        this.surveyActive = status;
    }

    private buildAlert =( type : number, msg : string ) : void => {
        if ( type == 1 ) {
            this.alert.type = 1;
            this.alert.title = "";
            this.alert.message = msg;
            this.alert.cssClass = "alert-success";
            this.alert.status = true;
        } else {
            this.alert.type = 0;
            this.alert.title = "Opz! "
            this.alert.message = msg;
            this.alert.cssClass = "alert-danger";
            this.alert.status = true;
            console.error( msg );
        }
    }
}
