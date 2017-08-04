import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionPersistService } from './../question-persist.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Question } from './../models/question.model';

@Component({
    selector: 'mm-create-modal',
    templateUrl: 'src/create-modal.component.html',
    styleUrls: ['src/create-modal.component.css'],
})
export class CreateModalComponent implements OnInit {

    question: Question;
    userDetails: FormGroup;
    source: LocalDataSource;
    @Input() question: Question;

    @ViewChild('modal')
        modal: CreateModalComponent;

    constructor(
        private fb: FormBuilder,
        private questionPersistService: QuestionPersistService
    ) {
     }

    ngOnInit(): void {
        this.userDetails = this.fb.group({
            location: [''],
            fullname: ['']
        });
    }

    open(size: string) {
        this.modal.open(size);
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
        if (!result) {
            return;
        }
        this.questionPersistService.create(value)
            .then(orderRequest => {
                this.question.push(orderRequest);
                this.source.add(orderRequest);
                this.source.refresh();
            });
    }
}
