import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionPersistService } from './../question-persist.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Question } from './../models/question.model';

@Component({
    selector: 'mm-create-modal',
    templateUrl: './create-modal.component.html',
    styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {

    question: Question;
    userDetails: FormGroup;
    source: LocalDataSource;

    @ViewChild( 'modal' )
        modal: CreateModalComponent;

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
        this.modal.open( size );
    }

    openModal( source ) {
        this.source = source;
        this.open( 'md' );
    }

    onSubmit({ value }: { value: Object }) {
        this.question.question = value[ 'pergunta' ];

        this.add( this.question );
        this.modal.close();
        this.userDetails.setValue({ pergunta : "", active: true });
    }

    add( value: Question ): void {

        if ( !value ) {
            return;
        }

        this.questionPersistService.createData( value )
            .then( data => {
                
                this.question.id = data.id;
                this.source.add( this.question );
                this.source.refresh();

            }, error => console.info( error ) );
    }

    close() {
        this.modal.close();
    }
}
