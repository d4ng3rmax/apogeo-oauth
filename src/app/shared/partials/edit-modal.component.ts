import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionService } from './../question.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Question } from './../models/question.model';

@Component({
    selector: 'mm-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./create-modal.component.scss'],
})
export class EditModalComponent implements OnInit {

    question: Question;
    userDetails: FormGroup;
    source: LocalDataSource;
    dataGrid : any;
    htmlActive : boolean;
    data: any;

    @ViewChild( 'modal' )
        modal: EditModalComponent;

    constructor(
        private fb: FormBuilder,
        private service: QuestionService
    ) {}

    ngOnInit(): void {
        this.question = new Question( 1, "", true );

        this.userDetails = this.fb.group({
            pergunta: '',
            active: true
        });
    }

    open( size: string ) {

        this.userDetails = this.fb.group({
            id: [ this.data.id ],
            pergunta: [ this.data.question ],
            active: [ this.data.active ]
        });

        this.htmlActive = this.data.active;
        this.modal.open( size );
    }

    openModal( dataGrid, event ) {
        this.dataGrid = dataGrid;
        this.data = event.data;
        this.source = dataGrid.source;
        this.open( 'lg' );
    }

    onSubmit({ value }: { value: Object }) {
        this.question.id = value[ 'id' ];
        this.question.question = value[ 'pergunta' ];
        this.question.active = value[ 'active' ];

        this.edit( this.question );
        this.modal.close();
    }

    edit( value: Question ): void {

        if ( !value ) {
            return;
        }

        this.service.updateData( value.id, value )
        .then( data => {
            
            this.question.id = data.id;
            this.source.update( this.data, value );
            this.source.refresh();
            this.dataGrid.buildAlert( 1, "Frase atualizada com sucesso!" );

        }, error => this.dataGrid.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    }

    close() {
        this.modal.close();
    }
}
