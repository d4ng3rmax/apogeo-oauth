import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SurveyService } from './../../shared/survey.service';
import { Http } from '@angular/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'data-grid',
    template: `
    <input #search class="search" type="text" placeholder="Search..." (keydown.enter)="onSearch(search.value)">
    <ng2-smart-table
    [settings]="settings"
    [source]="source"
    (editConfirm)="onSaveConfirm($event)"></ng2-smart-table>
    `,
    styleUrls: ['./data-grid.component.scss'],
    providers: [ SurveyService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    survey : any;

    // @Input() settings : {};
    // @Input() serviceUrl : string;
    actionType: number;
    userId: number;
    // source: ServerDataSource;
    source: LocalDataSource;
    serviceUrl = 'https://apogeo-survey-svc.cfapps.io/questions';
    data2 : Array<any>;

    constructor( public http: Http, private surveyService : SurveyService  ) {
        this.survey = this.surveyService;
    }

    async ngOnInit() {
        this.source = new LocalDataSource( await this.survey.getResult() );
        // this.source = new ServerDataSource(this.http, { endPoint: await this.survey.getResult() });
        console.info( this.source );

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
            // confirmDelete: true,
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
                width: "70%",
                filter: false
            },
            active: {
                title: 'Ativo',
                filter: {
                    type: 'checkbox',
                    config: {
                        true: 'true',
                        false: 'false',
                        resetText: 'Limpar',
                    },
                },
            }
        },
    };

    // data = [{"id":2,"active":false,"question":"Frase 1"},{"id":12,"active":false,"question":"Frase 2"},{"id":22,"active":false,"question":"Frase 3"},{"id":32,"active":false,"question":"Frase 4"}];

    onSearch(query: string = '') {
        this.source.setFilter([
            {
                field: 'id',
                search: query
            },
            {
                field: 'question',
                search: query
            },
            {
                field: 'active',
                search: query
            }
        ], false);
    }

    onSaveConfirm(event) {
        if (window.confirm('Cerrrrteza?')) {
            // event.newData['question'] += ' + added in code';
            event.confirm.resolve(event.newData);
            console.info( this.source );
        } else {
            event.confirm.reject();
        }
    }

}
