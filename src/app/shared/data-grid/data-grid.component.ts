import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Output } from '@angular/core';
import { Http } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { QuestionService } from './../question.service';
import { CreateModalComponent } from './../partials/create-modal.component';
import { EditModalComponent } from './../partials/edit-modal.component';
import { LocalDataSource } from 'ng2-smart-table';
import { Alert } from './../models/alert.model';

@Component({
    selector: 'data-grid',
    template: `<ng2-smart-table
    [settings]="settings"
    [source]="source"
    (create)="onCreate($event)"
    (edit)="onSave($event)"
    (delete)="onDeleteConfirm($event)"></ng2-smart-table>
    <mm-create-modal></mm-create-modal>
    <mm-edit-modal></mm-edit-modal>
    `,
    styleUrls: ['./data-grid.component.scss'],
    providers: [ QuestionService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    source : LocalDataSource;
    alert : Alert;

    constructor(
        public http: Http,
        private service : QuestionService
    ) {
        this.alert = new Alert( 0, "Title", "Message", "cssClass", false );
    }

    async ngOnInit() {
        this.source = new LocalDataSource( await this.service.getResult() );
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
            this.modalHtml.openModal( this);
        }

        onSave( event: any ) {
            this.modalHtmlEdit.openModal( this, event);
        }

        onDeleteConfirm ( event ) {
            
            if ( window.confirm( 'Deseja mesmo excluir essa frase?' ) ) {

                this.service.deleteData( event.data['id'] )
                    .then( data => {
                        this.source.remove( event.data );
                        this.buildAlert( 1, "Frase excluida com sucesso!" );
                    }, error => {
                        this.buildAlert( 0, JSON.parse( error._body ).errorMessage );
                    });
            } else {
                return false;
            }
        }

        private buildAlert =( type : number, msg : string ) : void => {
            if ( type == 1 ) {
                this.alert.type = 1;
                this.alert.title = "";
                this.alert.message = msg;
                this.alert.cssClass = "alert-success";
                this.alert.status = true;
            } else {
                this.alert.type = 0;
                this.alert.title = "Opz! "
                this.alert.message = msg;
                this.alert.cssClass = "alert-danger";
                this.alert.status = true;
                console.error( msg );
            }

            setTimeout( ()=> {
                this.alert.status = false;
                console.clear();
            }, 15000);
        }
    }
