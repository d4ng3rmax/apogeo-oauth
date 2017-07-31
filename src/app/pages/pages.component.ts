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

    moveItem = ( originSelect, from, to ) : void => {
        for ( let i = originSelect.length - 1; i >= 0; i-- ) {

            if ( originSelect[ i ].selected == true ) {

                let question = new Question(
                    originSelect[ i ].value,
                    originSelect[ i ].text
                );

                to.push( question );
                originSelect[i].remove();
            }
        }

        from.map( elFrom => {
            to.map( elTo => {
                if ( elTo.id == elFrom.id )
                    from.splice( from.indexOf( elFrom ), 1 );
            });
        });
    }

    moveAll = ( from, to ) : void => {
        from.forEach(el => {
            to.push( el );
        });

        from.length = 0;
    }

    moveUp = ( select, arrSelected ) : void => {

        for ( let i = select.length - 1; i >= 0; i-- ) {
            if ( select[ i ].selected == true ) {
                if ( i > 0 ) {
                    let selectedItem = arrSelected.splice( i, 1 );
                    arrSelected.splice( i - 1, 0, selectedItem[0] );
                }
            }
        }
    }

    moveDown = ( select ) : void => {
        let countOptions = select.options.length;

    }
}
