import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class PagesListService {

    results : Object[];
    apiRoot : string = 'https://apogeo-survey-svc.cfapps.io/pages';
    loading : boolean;
    lastRequestCount: number = 0;

    constructor( private http: Http ) {
        this.loading = false;
    }

    async getResult() : Promise<any> {

        const response = await this.http.get( `${ this.apiRoot }` )
            .toPromise()
        return response.json();
    }
}
