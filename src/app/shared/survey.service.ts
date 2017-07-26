import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class SurveyService {

    results : Object[];
    apiRoot : string = 'https://apogeo-survey-svc.cfapps.io/questions';
    loading : boolean;
    lastRequestCount: number = 0;

    constructor( private http: Http ) {
        this.results = [];
        this.loading = false;
    }

    count(): number {
        return this.lastRequestCount;
    }

    public getResult() : Promise<any> {

        let promise = new Promise( ( resolve, reject ) => {
            let apiURL = `${ this.apiRoot }`;

            this.http.get( apiURL )
                .toPromise()
                .then (
                    res => {
                        //console.info( res.json() );
                        this.results = res.json();
                        resolve();
                    },
                    msg => {
                        reject( msg );
                    }
                );
        });

        return promise;
    }
}
