import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionPersistService } from './../question-persist.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Question } from './../models/question.model';
import Tether from "tether";

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
        modal: ModalComponent;

    constructor(
        private fb: FormBuilder,
        private questionPersistService: QuestionPersistService
    ) {}

    ngOnInit(): void {
        this.question = new Question( 1, "", true );

        this.userDetails = this.fb.group({
            pergunta: ''
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
    }

    add( value: Question ): void {
        let result = JSON.stringify( value );

        if ( !result ) {
            return;
        }
        this.questionPersistService.createData( result );
        this.source.add( this.question );
        this.source.refresh();
    }

    close() {
        this.modal.close();
    }
}
