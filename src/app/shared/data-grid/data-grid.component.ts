import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Output } from '@angular/core';
import { Http } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { QuestionService } from './../question.service';
import { CreateModalComponent } from './../partials/create-modal.component';
import { EditModalComponent } from './../partials/edit-modal.component';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxComponent } from './../partials/custom-render/checkbox/checkbox.component';
import { Question } from './../models/question.model';
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
    statusActive : boolean = null;

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
        pager : {
            perPage: 10
        },
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
        noDataMessage: 'Nenhum registro encontrado',
        actions: {
            columnTitle: 'Ações',
            width: '200px'
        },
        columns: {
            question: {
                title: 'Frases',
                editor: {
                    type : 'textarea' 
                },
                width: "70%",
                filter: false
            },
            active: {
                title: 'Ativo',
                type: 'custom',
                renderComponent: CheckboxComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.saveStatus = this.saveStatus;
                },
                filter: false
            }
        }
    };

    changePerPage =( value : number ) : void => {
        this.source.setPaging(1, value, false);
        this.source.refresh();
    }

    onSearch( query: string = '', active ) {

        if ( query != '' && active != null ) {
            this.source.setFilter([
                {
                    field: 'question',
                    search: query
                },
                {
                    field: 'active',
                    search: active.toString()
                }
            ], true);

        } else if ( query == '' && active != null ) {

            this.source.reset();
            this.source.setFilter([
                {
                    field: 'active',
                    search: active.toString()
                }
            ], true);

        } else if ( active == null ) {

            this.source.setFilter([
                {
                    field: 'question',
                    search: query
                }
            ], true);
        }
    }

    clearFilter =() : void => {
        this.source.reset();
        this.statusActive = null;
        this.source.refresh();
    }

    sendInstance =() : void => {
        this.modalHtml.getInstance( this );
    }

    onCreate( event: any ) {
        this.alert.status = false;
        this.modalHtml.openModal( this );
    }

    onSave( event: any ) {
        this.modalHtmlEdit.openModal( this, event );
    }

    saveStatus =( rowData ) : void => {

        let newQ = new Question( rowData.id, rowData.question, !rowData.active );

        this.service.updateData( rowData.id, newQ )
        .then( data => {
            this.source.update( rowData, newQ );
            this.source.refresh();
            this.buildAlert( 1, "Frase atualizada com sucesso!" );

        }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    };

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
            this.alert.title = ""
            this.alert.message = msg;
            this.alert.cssClass = "alert-danger";
            this.alert.status = true;
            console.error( msg );
        }

        setTimeout( ()=> {
            //this.alert.status = false;
            console.clear();
        }, 25000);
    }
}
