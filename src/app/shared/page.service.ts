import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class PageService {

    private headers: Headers;
    results : Object[];
    apiRoot : string;
    loading : boolean;
    lastRequestCount: number = 0;

    constructor( private http: Http ) {
        this.loading = false;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.apiRoot = 'https://apogeo-survey-svc.cfapps.io/pages';
    }

    async getResult() : Promise<any> {
        
        const response = await this.http.get( `${ this.apiRoot }` )
            .toPromise()
        return response.json();
    }

    async getActiveResult() : Promise<any> {
        
        const response = await this.http.get( `${ this.apiRoot }/active` )
            .toPromise()
        return response.json();
    }

    async getSingleResult( id ) : Promise<any> {

        const response = await this.http.get( `${ this.apiRoot }/${ id }` )
            .toPromise()
        return response.json();
    }

    async createData( obj : Object ) : Promise<any> {
        return this.http.post( `${ this.apiRoot }`, JSON.stringify( obj ), { headers: this.headers })
            .toPromise()
            .then( ( res ) => res.json() || {} )
            .catch( ( error ) => Promise.reject( error.message || error ) );
    }

    async updateData( id: number, obj : Object ) : Promise<any> {
        return this.http.put( `${ this.apiRoot + '/' + id }`, JSON.stringify( obj ), { headers: this.headers })
            .toPromise()
            .then( ( res ) => res.json() || {} )
            .catch( ( error ) => Promise.reject( error.message || error ) );
    }

    async deleteData( id: number ) : Promise<any> {
        return this.http.delete( `${ this.apiRoot + '/' + id }`, { headers: this.headers })
            .toPromise()
            .then( ( res ) => res.json() || {} )
            .catch( ( error ) => Promise.reject( error.message || error ) );
    }

    async setStatus( obj ) : Promise<any> {
        return this.http.post( `${ this.apiRoot + '/' + obj.id + '/setActive' }`, JSON.stringify( obj ), { headers: this.headers })
            .toPromise()
            .then( ( res ) => res.json() || {} )
            .catch( ( error ) => Promise.reject( error.message || error ) );
    }
}
