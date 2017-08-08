import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionPersistService } from './../question-persist.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Question } from './../models/question.model';
import * as $ from 'jquery';

@Component({
    selector: 'mm-create-modal',
    templateUrl: './create-modal.component.html',
    styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {

    @Input() question: Question;

    userDetails: FormGroup;
    source: LocalDataSource;

    @ViewChild( 'modal' )
        modal: CreateModalComponent;

    constructor(
        private fb: FormBuilder,
        private questionPersistService: QuestionPersistService
    ) {}

    ngOnInit(): void {
        this.userDetails = this.fb.group({
            location: [''],
            fullname: ['']
        });
    }

    open( size: string ) {
        this.modal.open( size );
    }

    openModal( source ) {
        this.source = source;
        this.open( 'sm' );
    }

    onSubmit({ value, valid }: { value: Question, valid: boolean }) {
        this.add({ value, valid });
        this.modal.close();
    }

    close() {
        this.modal.close();
    }

    add({ value, valid }: { value: Question, valid: boolean }): void {
        let result = JSON.stringify(value);

        if ( !result ) {
            return;
        }
        this.questionPersistService.createData( value );
    }
}
