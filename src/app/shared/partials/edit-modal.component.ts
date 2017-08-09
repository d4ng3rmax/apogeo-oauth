import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionPersistService } from './../question-persist.service';
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
    data: any;

    @ViewChild( 'modal' )
        modal: EditModalComponent;

    constructor(
        private fb: FormBuilder,
        private questionPersistService: QuestionPersistService
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
        
        this.modal.open( size );
    }

    openModal( event, source ) {
        this.data = event.data;
        this.source = source;
        this.open( 'md' );
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

        this.questionPersistService.updateData( value.id, value );
        this.source.update( this.data, value );
        this.source.refresh();
    }

    close() {
        this.modal.close();
    }
}
