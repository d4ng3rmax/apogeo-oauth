import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { PageService } from './../page.service';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxComponent } from './../partials/custom-render/checkbox/checkbox.component';
import { Page } from './../models/page.model';
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
    statusActive : boolean = null;
    
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
        noDataMessage: 'Nenhum registro encontrado',
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
                type: 'custom',
                renderComponent: CheckboxComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.saveStatus = this.saveStatus;
                },
                filter: false
            }
        }
    };

    onCreate() {
        this.router.navigate( ['/page' ] );
    }

    changePerPage =( value : number ) : void => {
        this.source.setPaging(1, value, false);
        this.source.refresh();
    }
    
    onSearch( query: string = '', active ) {
        
        if ( query != '' && active != null ) {
            this.source.setFilter([
                {
                    field: 'title',
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
                    field: 'title',
                    search: query
                }
            ], true);
        }
    }
    
    clearFilter =(): void => {
        this.source.reset();
        this.statusActive = null;
        this.source.refresh();
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

    saveStatus =( rowData ) : void => {
        let newP = { id: rowData.id, title: rowData.title, active: !rowData.active };

        this.service.setStatus( newP )
        .then( data => {
            this.source.update( rowData, newP );
            this.source.refresh();
            this.buildAlert( 1, "Frase atualizada com sucesso!" );

        }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );
    };

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
        }, 15000);
    }
    
}
    