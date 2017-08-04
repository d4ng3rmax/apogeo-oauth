import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { QuestionListService } from './../question-list.service';
import { QuestionPersistService } from './../question-persist.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'data-grid',
    template: `<ng2-smart-table
    [settings]="settings"
    [source]="source"
    (createConfirm)="onCreateConfirm($event)"
    (editConfirm)="onSaveConfirm($event)"
    (deleteConfirm)="onDeleteConfirm($event)"></ng2-smart-table>
    `,
    styleUrls: ['./data-grid.component.scss'],
    providers: [ QuestionListService, QuestionPersistService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    listServer : any;
    persistServer : any;
    source: LocalDataSource;

    constructor(
        public http: Http,
        private questionList : QuestionListService,
        private questionPersistService : QuestionPersistService
    ) {
        this.listServer = this.questionList;
        this.persistServer = questionPersistService;
    }

    async ngOnInit() {
        this.source = new LocalDataSource( await this.listServer.getResult() );
    }

    settings = {
        add: {
            confirmCreate: true,
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
                title: 'Frases',
                editor: {
                    type : 'textarea' },
                width: "70%",
                filter: false
            },
            active: {
                title: 'Ativo',
                class: 'xxxx',
                editor: {
                    type: 'list',
                    config: {
                        list: [
                            { title: 'Ativo', value: true },
                            { title: 'Desativado', value: false }
                        ]
                    }
                },
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

    onSearch( query: string = '', active ) {

        if ( query == '' ) {
            this.source.reset();
            return;
        }

        this.source.setFilter([
            {
                field: 'question',
                search: query
            },
            {
                field: 'active',
                search: active
            }
        ], true);
    }

    clearFilter =(): void => {
        this.source.reset();
    }

    onCreateConfirm( event ) {
        if ( window.confirm( 'Confirma a criação dessa frase?' ) ) {
            // event.newData['name'] += ' + added in code';
            event.newData['active'] = event.newData['active'];
            let editService = this.persistServer.createData( 1, event.newData );
            event.confirm.resolve( event.newData );
        } else {
            event.confirm.reject();
        }
    }

    onSaveConfirm( event ) {
        if ( window.confirm( 'Confirma a atualização dessa frase?' ) ) {
            let createService = this.persistServer.updateData( event.newData['id'], event.newData );
            event.confirm.resolve( event.newData );
        } else {
            event.confirm.reject();
        }
    }

    onDeleteConfirm( event ) {
        if ( window.confirm( 'Deseja mesmo excluir essa frase?' ) ) {
            let createService = this.persistServer.deleteData( event.data['id'] );
            event.confirm.resolve();
        } else {
            event.confirm.reject();
        }
    }

}
