import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DataGridComponent } from './../shared/data-grid/data-grid.component';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./../shared/data-grid/data-grid.component.scss']
})
export class QuestionListComponent implements OnInit {

    @ViewChild( DataGridComponent ) dataGrid : DataGridComponent;

    active : boolean;
    alertClass: string;
    alertOn: boolean = false;
    alertMessage : string;

    constructor() {
        this.active = true;
        this.alertMessage = `<strong>Opz!</strong> Deu erro!`;
    }

    ngOnInit() {}

    public onSearch = ( value ) : void => {
        this.dataGrid.onSearch( value, this.active );
    }

    public clearFilter = ( search ) : void => {
        this.dataGrid.clearFilter();
        search.reset();
    }
}
