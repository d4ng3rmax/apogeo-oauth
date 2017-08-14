import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { PageService } from './../page.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Alert } from './../models/alert.model';

@Component({
    selector: 'data-grid-pages',
    template: `<ng2-smart-table
    [settings]="settings" 
    [source]="source" 
    (create)="onCreate()"  
    (edit)="onEdit($event)" 
    (delete)="onDeleteConfirm($event)"></ng2-smart-table>
    `,
    styleUrls: ['./../data-grid/data-grid.component.scss'],
    providers: [ PageService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridPagesComponent implements OnInit {
    
    source: LocalDataSource;
    alert : Alert;
    
    constructor(
        private router: Router, 
        public http: Http,
        private service : PageService
    ) {
        this.alert = new Alert( 0, "Title", "Message", "cssClass", false );
    }
    
    async ngOnInit() {
        this.source = new LocalDataSource( await this.service.getResult() );
    }
    
    settings = {
        mode: 'external',
        add: {
            confirmCreate: true,
            addButtonContent: '<i class="fa fa-plus"><span>Adicionar Página</span></i>',
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
            title: {
                title: 'Páginas',
                editor: {
                    type : 'textarea'
                },
                width: "70%",
                filter: false
            },
            active: {
                title: 'Ativo',
                filter: false
            }
        }
    };

    onCreate() {
        this.router.navigate( ['/page' ] );
    }
    
    onSearch( query: string = '', active ) {
        
        if ( query == '' ) {
            this.source.reset();
            return;
        }
        
        this.source.setFilter([
            {
                field: 'title',
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
    
    onDeleteConfirm( event ) {
        
        if ( window.confirm( 'Deseja mesmo excluir essa página?' ) ) {

            this.service.deleteData( event.data['id'] )
                .then( data => {
                    this.source.remove( event.data );
                    this.buildAlert( 1, "Página excluida com sucesso!" );
                }, error => {
                    this.buildAlert( 0, JSON.parse( error._body ).errorMessage );
                });
        } else {
            return false;
        }
    }
    
    onEdit( event: any ) {
        this.router.navigate( ['/page', event.data.id ] );
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
    