import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { SurveyListService } from './../survey-list.service';
import { SurveyPersistService } from './../survey-persist.service';
import { LocalDataSource } from 'ng2-smart-table';

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
    providers: [ SurveyListService, SurveyPersistService ],
    encapsulation: ViewEncapsulation.None
})
export class DataGridSurveyComponent implements OnInit {
    
    listServer : any;
    persistServer : any;
    source: LocalDataSource;
    
    constructor(
        private router: Router, 
        public http: Http,
        private pageList : SurveyListService,
        private questionPersistService : SurveyPersistService
    ) {
        this.listServer = this.pageList;
        this.persistServer = questionPersistService;
    }
    
    async ngOnInit() {
        this.source = new LocalDataSource( await this.listServer.getResult() );
    }
    
    settings = {
        mode: 'external',
        add: {
            confirmCreate: true,
            addButtonContent: '<i class="fa fa-plus"><span>Adicionar Questionário</span></i>',
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
            title: {
                title: 'Questionário',
                editor: {
                    type : 'textarea' },
                    width: "70%",
                    filter: false
                },
                active: {
                    title: 'Ativo',
                    filter: false
                }
            },
        };

        onCreate() {
            this.router.navigate( ['/survey' ] );
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
            if ( window.confirm( 'Deseja mesmo excluir esse Questionário?' ) ) {
                let createService = this.persistServer.deleteData( event.data['id'] );
                this.source.remove( event.data );
            } else {
                return false;
            }
        }
        
        onEdit( event: any ) {
            this.router.navigate( ['/survey', event.data.id ] );
        }
        
    }
    