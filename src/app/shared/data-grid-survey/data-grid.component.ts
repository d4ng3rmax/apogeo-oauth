import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { SurveyService } from './../survey.service';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxComponent } from './../partials/custom-render/checkbox/checkbox.component';
import { Survey } from './../models/survey.model';
import { Alert } from './../models/alert.model';

@Component({
    selector: 'data-grid-survey',
    template: `<ng2-smart-table
    [settings]="settings" 
    [source]="source" 
    (create)="onCreate()"  
    (edit)="onEdit($event)" 
    (delete)="onDeleteConfirm($event)"></ng2-smart-table>
    `,
    styleUrls: ['./../data-grid/data-grid.component.scss'],
    providers: [ SurveyService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridSurveyComponent implements OnInit {
    
    source: LocalDataSource;
    alert : Alert;
    statusActive : boolean = null;
    
    constructor(
        private router: Router, 
        public http: Http,
        private service : SurveyService
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
            addButtonContent: '<i class="fa fa-plus"><span>Adicionar Questionário</span></i>',
            createButtonContent: '<i class="fa fa-pencil"><span>Criar</span></i>',
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
                title: 'Questionário',
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

    onCreate() {
        this.router.navigate( ['/survey' ] );
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
    }
    
    onDeleteConfirm( event ) {
        if ( window.confirm( 'Deseja mesmo excluir esse Questionário?' ) ) {

            this.service.deleteData( event.data['id'] )
                .then( data => {
                    this.source.remove( event.data );
                    this.buildAlert( 1, "Questionário excluido com sucesso!" );
                }, error => {
                    this.buildAlert( 0, JSON.parse( error._body ).errorMessage );
                });
        } else {
            return false;
        }
    }
    
    onEdit( event: any ) {
        this.router.navigate( ['/survey', event.data.id ] );
    }

    saveStatus =( rowData ) => {

        for ( let i = 0; i < this.source['data'].length; i++ ) {
            let newS = { id: rowData.id, active: rowData.active, title: rowData.title };
            // source, new value
            this.source.update( this.source['data'][ i ], this.source['data'][ i ] );
        }

        this.buildAlert( 0, "Operação não permitida! Você precisa ativar um outro questionário para desativar esse." );
            
        if ( rowData.active === false ) {

            if ( window.confirm( 'Apenas um questionário pode estar ativo ao mesmo tempo. Ao ativar este questionário, o anterior será inativado. Deseja continuar?' ) ) {

                this.service.setStatus( rowData.id )
                    .then( data => {
                        this.buildAlert( 1, "Questinário salvo com sucesso!" );
                        

                        for ( let i = 0; i < this.source['data'].length; i++ ) {
                            
                            if ( this.source['data'][ i ].id != rowData.id ) {
                                let newS1 = { id: this.source['data'][ i ].id, active: false, title: this.source['data'][ i ].title };
                                this.source.update( this.source['data'][ i ], newS1 );
                            }
                            else {
                                let newS2 = { id: rowData.id, active: true, title: rowData.title };
                                this.source.update( this.source['data'][ i ], newS2 );
                            }
                        }
                        this.source.reset();
                        this.source.refresh();
                        
                    }, error => this.buildAlert( 0, JSON.parse( error._body ).errorMessage ) );

            } else {
                return false;
            }
        }
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
    