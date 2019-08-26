import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { constants as consts } from '../constants'
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${consts.DomainURL}SellffDefault/RegisterSellffUserInfo`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/${id}`);
    }
    
    CheckIfUserExists(keystring: string){
        return this.http.get<number>(`${consts.DomainURL}SellffDefault/CheckIfUserAlreadyEsists/${keystring}/1`);
    }

    ActivateUserAccunt(keystring: string): Observable<any>{
        return this.http.get<any>(`${consts.DomainURL}SellffDefault/ActivateUserAccunt/${keystring}`);
    }

}