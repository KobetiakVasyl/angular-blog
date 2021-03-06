import {Injectable} from '@angular/core'
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import {Observable, Subject, throwError} from "rxjs"
import {environment} from "../../../../environments/environment"
import {catchError, tap} from "rxjs/operators"

import {FireBaseAuthResponse, User} from "../../../shared/interfaces"

@Injectable({providedIn: 'root'})

export class AuthService {

  error$: Subject<string> = new Subject<string>()

  constructor(private http: HttpClient) {
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-expires'))

    if (new Date() > expDate) {
      this.logout()
      return null
    }

    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Email is invalid')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Password is invalid')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email is not found')
        break
    }

    return throwError(error)
  }

  private setToken(response: FireBaseAuthResponse | null) {
    if (response) {
      const expireDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-expires', expireDate.toString())
    } else {
      localStorage.clear()
    }
  }
}
