import { Injectable, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Alert } from './models/alert.model';

@Injectable()
export class QuestionPersistService {

    private headers: Headers;
    apiRoot : string = 'https://apogeo-survey-svc.cfapps.io/questions';
    loading : boolean;
    lastRequestCount: number = 0;
    alert : Alert;

    constructor( private http: Http ) {
        this.loading = false;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.alert = new Alert( 0, "Title", "Message", "alert-danger", false );
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
                data => console.info( "Editando..." ),
                err => console.error( err ),
                () => console.log( 'Editado!' )
            );
    }

    async deleteData( id: number ) : Promise<any> {

        this.http.delete( `${ this.apiRoot + '/' + id }`, { headers: this.headers })
            .map( res => res.json() )
            .subscribe(
                data => {
                    console.info( "Excluindo..." );
                },
                err => {
                    console.info( "deu erro..." );
                    this.setAlert( 0, "Opz!", JSON.parse( err._body ).errorMessage, "alert-danger", 1 );
                    
                    setTimeout( ()=> {
                        this.alert.status = false;
                    }, 5000);
                },
                () => {
                    console.log( 'Excluido!' );
                }
            );
    }

    private setAlert =( type, title, message, cssClass, status ) => {
        this.alert = new Alert( type, `<strong>${ title }</strong> `, message, cssClass, status );
    }

}
