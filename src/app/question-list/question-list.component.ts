import { Component, OnInit } from '@angular/core';
import { SurveyService } from './../shared/survey.service';
import { Subject } from 'rxjs/Rx';

//declare var $;

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss'],
    providers: [ SurveyService ]
})
export class QuestionListComponent implements OnInit {

    survey : any;
    public serviceUrl = 'https://apogeo-survey-svc.cfapps.io/questions';

    constructor( private surveyService : SurveyService ) {
        this.survey = this.surveyService;
        this.survey.getResult();
    }

    ngOnInit() {
    }

    settings = {
        add: {
            addButtonContent: '<i class="fa fa-plus"><span>Adicionar Pergunta</span></i>',
            createButtonContent: '<i class="fa fa-check"><span>Criar</span></i>',
            cancelButtonContent: '<i class="fa fa-close"><span>Cancelar</span></i>',
        },
        edit: {
            confirmSave: true,
            editButtonContent: '<i class="fa fa-edit"><span>Editar</span></i>',
            saveButtonContent: '<i class="fa fa-check"><span>Salvar</span></i>',
            cancelButtonContent: '<i class="fa fa-close"><span>Cancelar</span></i>',
        },
        delete: {
            confirmDelete: true,
            deleteButtonContent: '<i class="fa fa-close"><span>Excluir</span></i>',
        },
        actions: {
            columnTitle: 'Ações',
            width: '200px'
        },
        columns: {
            question: {
                title: 'Perguntas',
                editor: { type : 'textarea' },
                width: "70%"
            },
            active: {
                title: 'Ativo',
                editor: { type : 'select' }
            }
        },
    };

    confirmEdit =() : void => {
        console.info( "6jp" );
    }

    confirmSave =() : void => {
        console.info( "8jp" );
    }

}
