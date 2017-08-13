import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { QuestionListService } from './../question-list.service';
import { QuestionPersistService } from './../question-persist.service';
import { CreateModalComponent } from './../partials/create-modal.component';
import { EditModalComponent } from './../partials/edit-modal.component';
import { LocalDataSource } from 'ng2-smart-table';
import { Alert } from './../models/alert.model';

@Component({
    selector: 'data-grid',
    template: `<div class="row">
        <div class="col-12">
            <div class="alert {{ persistServer.alert.cssClass }} alert-dismissible fade show" role="alert" *ngIf="persistServer.alert.status">
                <button type="button" class="close" aria-label="Close" (click)="closeAlert(); false;">
                    <span aria-hidden="true">&times;</span>
                </button>
                <span [innerHTML]="persistServer.alert.title"></span>{{ persistServer.alert.message }} 
            </div>
        </div>
    </div>
    <ng2-smart-table
    [settings]="settings"
    [source]="source"
    (create)="onCreate($event)"
    (edit)="onSave($event)"
    (delete)="onDeleteConfirm($event)"
    (deleteConfirm)="onDeleteConfirm($event)"></ng2-smart-table>
    <mm-create-modal></mm-create-modal>
    <mm-edit-modal></mm-edit-modal>
    `,
    styleUrls: ['./data-grid.component.scss'],
    providers: [ QuestionListService, QuestionPersistService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    listServer : any;
    persistServer : any;
    source : LocalDataSource;
    alert: Alert;

    constructor(
        public http: Http,
        private questionList : QuestionListService,
        private questionPersistService : QuestionPersistService
    ) {
        this.listServer = this.questionList;
        this.persistServer = questionPersistService;
        this.alert = this.persistServer.alert;
    }

    async ngOnInit() {
        this.source = new LocalDataSource( await this.listServer.getResult() );
    }

    @ViewChild( CreateModalComponent )
        modalHtml: CreateModalComponent;

    @ViewChild( EditModalComponent )
        modalHtmlEdit: EditModalComponent;

    settings = {
        mode: 'external',
        add: {
            type:'html',
            confirmCreate: true,
            addButtonContent: '<i class="fa fa-plus"><span> Adicionar Frase</span></i>',
            createButtonContent: '<i class="fa fa-check"><span>Criar</span></i>',
            cancelButtonContent: '<i class="fa fa-close"><span>Cancelar</span></i>',
        },
        edit: {
            confirmSave: true,
            editButtonContent: '<i class="fa fa-pencil"><span>Editar</span></i>',
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

        onCreate( event: any ) {
            this.modalHtml.openModal( this.source );
        }

        onSave( event: any ) {
            this.modalHtmlEdit.openModal( event, this.source );
        }

        onDeleteConfirm( event ) {
            if ( window.confirm( 'Deseja mesmo excluir essa frase?' ) ) {
                this.persistServer.alert.status = false;
                this.persistServer.deleteData( event.data['id'] )

                setTimeout( ()=> {
                    if ( this.persistServer.alert.status === false ) { this.source.remove( event.data ) }
                }, 1000);
            
            } else {
                return false;
            }
        }

        closeAlert =() : void => {
            this.persistServer.alert.status = false;
        }
    }
