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

    active : boolean;

    constructor() {
        this.active = true;
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
