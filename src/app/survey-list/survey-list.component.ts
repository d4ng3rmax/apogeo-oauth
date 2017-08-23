import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DataGridSurveyComponent } from './../shared/data-grid-survey/data-grid.component';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-survey-list',
    templateUrl: './survey-list.component.html',
    styleUrls: ['./../shared/data-grid/data-grid.component.scss']
})
export class SurveyListComponent implements OnInit {

    @ViewChild( DataGridSurveyComponent ) dataGrid : DataGridSurveyComponent;

    menuEnabled : boolean = true;

    constructor() { }

    ngOnInit() {}

    public onSearch = ( value ) : void => {
        this.dataGrid.onSearch( value, this.dataGrid.statusActive );
    }

    public searchByStatus =( value, status ) : void => {
        this.dataGrid.statusActive = status;
        this.dataGrid.onSearch( value, this.dataGrid.statusActive );
    }

    public clearFilter =( search ) : void => {
        this.dataGrid.clearFilter();
        search.reset();
    }

    public closeAlert =() : void => {
        this.dataGrid.alert.status = false;
    }

    public setPerPage =( items : number ) : void => {
        this.dataGrid.changePerPage( items );
    }

}
