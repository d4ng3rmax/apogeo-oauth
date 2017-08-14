import { Component, ViewChild, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionService } from './../question.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Question } from './../models/question.model';

@Component({
    selector: 'mm-create-modal',
    templateUrl: './create-modal.component.html',
    styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {

    question : Question;
    userDetails : FormGroup;
    source : LocalDataSource;
    dataGrid : any;

    @ViewChild( 'modal' )
        modal: CreateModalComponent;

    constructor(
        private fb: FormBuilder,
        private service: QuestionService,
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

    openModal( dataGrid ) {
        this.dataGrid = dataGrid;
        this.source = dataGrid.source;
        this.open( 'md' );
    }

    onSubmit({ value }: { value: Question }) {
        this.question = new Question( null, value[ 'pergunta' ], true );
        this.add( this.question );

        this.modal.close();
        this.userDetails.setValue({ pergunta : "", active: true });
    }

    add( value: Question ): void {

        if ( !value ) {
            return;
        }

        this.service.createData( value )
            .then( data => {

                this.question.id = data.id;
                this.source.add( this.question );
                this.source.refresh();
                this.dataGrid.buildAlert( 1, "Frase criada com sucesso!" );

            }, error => this.dataGrid.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    }

    close() {
        this.modal.close();
    }
}
