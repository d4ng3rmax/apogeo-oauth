import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionListComponent } from './../question-list/question-list.component';
import { PageService } from './../shared/page.service';
import { QuestionService } from './../shared/question.service';
import { Question } from './../shared/models/question.model';
import { Page } from './../shared/models/page.model';
import { Alert } from './../shared/models/alert.model';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    providers: [ PageService, QuestionService ]
})
export class PageComponent implements OnInit {

    menuEnabled : boolean = false;
    listPath : string = "/page/list";
    urlId : number;
    pageTitle: string;
    pageActive : boolean;
    avaliableItems : Array<any> = [];
    selectedItems : Array<any> = [];
    pageItems : Page;
    alert : Alert;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service : PageService,
        private questionListService : QuestionService
    ) {
        this.urlId = ( this.route.snapshot.params['id'] ) ? this.route.snapshot.params['id'] : false;
        this.pageItems = new Page( 0, "", {}, false );
        this.alert = new Alert( 0, "Title", "Message", "cssClass", false );
    }

    async ngOnInit() {
        let avaliableItemsAll = await this.questionListService.getResult();

        if ( this.urlId ) {
            let serverPageItems = await this.service.getSingleResult( this.urlId );
            this.pageItems = new Page( serverPageItems.id, serverPageItems.title, serverPageItems.questionOrder, serverPageItems.active );
            this.selectedOnThisPage( avaliableItemsAll );
            this.avaliableOnThisPage( avaliableItemsAll );
            this.pageTitle = serverPageItems.title;
            this.pageActive = serverPageItems.active;
        } else {
            this.pageTitle = "";
            this.pageActive = true;
            this.avaliableItems = avaliableItemsAll;
        }
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

    moveBottom =( select, arrSelected ) : void => {
        let selectCount = select.length;

        for ( let i = select.length - 1; i >= 0; i-- ) {
            if ( select[ i ].selected == true ) {
                let selectedItem = arrSelected.splice( i, 1 );
                arrSelected.splice( selectCount, 0, selectedItem[ 0 ] );
            }
        }
    }

    avaliableOnThisPage =( all ) : void => {

        for ( let prop in this.pageItems.questionOrder ) {
            all.splice( all.findIndex( q => q.id == this.pageItems.questionOrder[ prop ].id ), 1 );
        }

        this.avaliableItems = all;
    }

    selectedOnThisPage =( all ) : void => {
        for ( let i = 0; i < all.length; i++ ) {
            for ( let prop in this.pageItems.questionOrder ) {
                if ( all[ i ].id == this.pageItems.questionOrder[ prop ].id ) {
                    this.selectedItems.push( all[ i ] );
                }
            }
        }
    }

    populatedPage =() : Page => {
        let qo = new Page( 1, this.pageTitle, {}, this.pageActive );

        for ( let i = 0; i < this.selectedItems.length; i++ ) {
            qo.questionOrder[ i + 1 ] = { "id" : this.selectedItems[ i ].id }
        }
        return qo;
    }

    save =( event ) : void => {
        this.service.createData( this.populatedPage() )
            .then( data => {
                this.buildAlert( 1, "Página criada com sucesso!" );

                setTimeout( ()=> {
                    this.router.navigate( ['/page/list' ] );
                }, 2000);

            }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    }

    update =( event ) : void => {
        this.service.updateData( this.urlId, this.populatedPage() )
            .then( data => {
                this.buildAlert( 1, "Página atualizada com sucesso!" );

            }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    }

    delete =( event ) => {
        if ( window.confirm( 'Deseja mesmo excluir essa pergunta?' ) ) {
            this.service.deleteData( this.urlId )
                .then( data => {
                    this.buildAlert( 1, "Pergunta excluida com sucesso!" );

                    setTimeout( ()=> {
                        this.router.navigate( ['/page/list' ] );
                    }, 2000);
                }, error => {
                    this.buildAlert( 0, JSON.parse( error._body ).errorMessage );
                });
                
        } else {
            return;
        }
    }

    setStatus = ( status : boolean ) : void => {
        this.pageActive = status;
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
