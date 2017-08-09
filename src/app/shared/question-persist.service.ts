import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class QuestionPersistService {

    private headers: Headers;
    apiRoot : string = 'https://apogeo-survey-svc.cfapps.io/questions';
    loading : boolean;
    lastRequestCount: number = 0;

    constructor( private http: Http ) {
        this.loading = false;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    async createData( obj : Object ) : Promise<any> {
        this.http.post( `${ this.apiRoot }`, JSON.stringify( obj ), { headers: this.headers })
            .map( res => res.json() )
            .subscribe(
                data => console.info( "Criando..." ),
                err => console.error( err ),
                () => console.log( 'Criado!' )
            );
    }

    async updateData( id: number, obj : Object ) : Promise<any> {
        this.http.put( `${ this.apiRoot + '/' + id }`, JSON.stringify( obj ), { headers: this.headers })
            .map( res => res.json() )
            .subscribe(
                data => console.info( "Salvando..." ),
                err => console.error( err ),
                () => console.log( 'Salvo!' )
            );
    }

    async deleteData( id: number ) : Promise<any> {
        this.http.delete( `${ this.apiRoot + '/' + id }`, { headers: this.headers })
            .map( res => res.json() )
            .subscribe(
                data => console.info( "Salvando..." ),
                err => console.error( err ),
                () => console.log( 'Salvo!' )
            );
    }
}
