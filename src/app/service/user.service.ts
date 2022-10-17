import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserDto } from '../model/create-user.dto';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  backendUrl: string;

  constructor(private http: HttpClient) {
    this.backendUrl = 'http://cdn-backend.herokuapp.com/user'
  }

  addUser(usr: CreateUserDto): Observable<User>{
    return this.http.post<User>(this.backendUrl, usr);
  }

  getAllUser(): Observable<User[]>{
    return this.http.get<User[]>(this.backendUrl);
  }

  updateUser(usr: User): Observable<User>{
    return this.http.put<User>(this.backendUrl+"/"+usr.id, usr);
  }

  deleteUser(id: number): Observable<User>{
    return this.http.delete<User>(this.backendUrl+'/'+id);
  }
}
