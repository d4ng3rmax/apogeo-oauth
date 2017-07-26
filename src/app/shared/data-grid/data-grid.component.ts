import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'data-grid',
    template: `
    <input #search class="search" type="text" placeholder="Search..." (keydown.enter)="onSearch(search.value)">
    <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
    `,
    styleUrls: ['./data-grid.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    // @Input() settings : {};
    // @Input() serviceUrl : string;
    actionType: number;
    userId: number;
    survey : any;
    //source: ServerDataSource;
    source: LocalDataSource;
    serviceUrl = 'https://apogeo-survey-svc.cfapps.io/questions';

    constructor( public http: Http ) {
        // this.source = new ServerDataSource(http, { endPoint: 'https://apogeo-survey-svc.cfapps.io/questions' });
        this.source = new LocalDataSource( this.data );
    }

    ngOnInit() {
        //this.source = new ServerDataSource(this.http, { endPoint: this.serviceUrl });
        //this.actionType = 0;
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
            confirmDelete: true,
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
                width: "70%"
            },
            active: {
                title: 'Ativo',
                editor: { type : 'select' }
            }
        },
    };

    data = [{"id":2,"active":false,"question":"Frase 1"},{"id":12,"active":false,"question":"Frase 2"},{"id":22,"active":false,"question":"Frase 3"},{"id":32,"active":false,"question":"Frase 4"}];

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

}
