import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    template: `
        <div class="check">
            <input type="checkbox" name="checkbox{{ rowVal.id }}" id="checkbox{{ rowVal.id }}" class="ios-toggle" [checked]="rowVal.active" />
            <label for="checkbox{{ rowVal.id }}" class="checkbox-label" data-off="Desativado" data-on="Ativo"></label>
        </div>
    `,
})
export class CheckboxComponent implements ViewCell, OnInit {
    
    renderValue: string;
    rowVal : any;

    @Input() value: string | number;
    @Input() rowData: any;
    
    ngOnInit() {
        this.renderValue = this.value.toString();
        this.rowVal = this.rowData;
    }
    
}
