import { QuestionListComponent } from './../question-list/question-list.component';
import { Component, OnInit } from '@angular/core';
import { QuestionListService } from './../shared/question-list.service';
import { Question } from './../question/question.model';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    providers: [ QuestionListService ]
})
export class PagesComponent implements OnInit {

    avaliableItems : Array<any> = [];
    selectedItems : Array<any> = [];
    listService : any;
    items : Question;

    constructor( private questionListService : QuestionListService ) {
        this.listService = this.questionListService;
    }

    async ngOnInit() {
        this.avaliableItems = await this.listService.getResult();
    }

    moveItem = ( item, from, to ) : void => {

        for ( let i = 0; i < item.length; i++ ) {
            if ( item[ i ].selected == true ) {
                let arr = new Question(
                    item[ i ].value,
                    item[ i ].text
                );
                console.info( "--->" );
                console.info( item.selectedIndex );
                item.remove( item.selectedIndex );

                from.map(el => {
                    
                    if ( el.id == item[ i ].value ) {
                        //console.info( el.id );
                        //from.splice( item[ i ], 1 );
                        //el.remove(  )
                        //console.info( from );
                    }
                });
                //console.info( this.avaliableItems );
                to.push( arr );
            }
        }
        // console.info( "-----" );
        // console.info( this.selectedItems );


        


        //console.info( item );
        // console.info( this.avaliableItems );
        // console.info( this.selectedItems );

        

        // item.options.forEach(el => {
        //     if ( el.selectedIndex == 1 ) {
        //         from.splice( idx, 1 );
        //         to.push( item );
        //     }

        //     idx = from.indexOf( item );

        //     if ( idx != 1 ) {
        //         from.splice( idx, 1 );
        //         to.push( item );
        //     }
        // });


    }

    moveAll = ( from, to ) : void => {
        console.info('Move all  From:: '+from+' To:: '+to);

        from.forEach(el => {
            to.push( el );
        });

        from.length = 0;
    }
}
