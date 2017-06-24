import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/rx';

export class User {
  name: string;
  email: string;
  tipo: number;
  coord_x: number;
  coord_y: number;
 
  constructor(name: string, email: string, tipo: number, coord_x: number, coord_y: number) {
    this.name = name;
    this.email = email;
    this.tipo = tipo;
    this.coord_x = coord_x;
    this.coord_y = coord_y;
  }
}

@Injectable()
export class AuthService {

  constructor(public http: Http) {}

  currentUser: User;
  estado: boolean;
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Ingrese sus Credenciales");
    } else {
      return Observable.create(observer => {

        let headers = new Headers({ 'content-type': 'application/json',

      });
        let options = new RequestOptions({ headers: headers });

        var pw = btoa(credentials.email+":"+credentials.password);

         this.http.get('http://'+pw+'@localhost/api/login')
           .subscribe(data => {
             data.json();
             
             if(data['estado'] == 1)
             {
                this.currentUser = new User(data['user']['name'], credentials.email, data['user']['tipo'], data['user']['coord_x'], data['user']['coord_y']);
                this.estado = true;
             }
             else
             {
               this.estado = false;
              return Observable.throw("Credenciales erróneas");
             }
         });

        observer.next(this.estado);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

}
