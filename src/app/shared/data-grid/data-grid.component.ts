import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { QuestionListService } from './../../shared/question-list.service';
import { QuestionEditService } from './../question-edit.service';
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
    providers: [ QuestionListService, QuestionEditService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    listServer : any;
    editServer : any;

    actionType: number;
    userId: number;
    // source: ServerDataSource;
    source: LocalDataSource;
    //serviceUrl = 'https://apogeo-survey-svc.cfapps.io/questions';
    data2 : Array<any>;

    constructor(
        public http: Http,
        private questionList : QuestionListService,
        private questionEditService : QuestionEditService
    ) {
        this.listServer = this.questionList;
        this.editServer = questionEditService;
    }

    async ngOnInit() {
        this.source = new LocalDataSource( await this.listServer.getResult() );
        // this.source = new ServerDataSource(this.http, { endPoint: await this.listSerever.getResult() });
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
        if (window.confirm('Confirme a atualização dessa frase?')) {
            // event.newData['question'] += ' + added in code';
            let editService = this.editServer.getResult( event.newData['id'], event.newData );
            event.confirm.resolve(event.newData);
        } else {
            event.confirm.reject();
        }
    }

}
