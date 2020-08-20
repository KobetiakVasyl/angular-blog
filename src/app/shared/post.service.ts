import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {Observable} from "rxjs"
import {CreateFbResponse, GetFbResponse, Post} from "./interfaces"
import {environment} from "../../environments/environment"
import {map} from "rxjs/operators"

@Injectable({providedIn: 'root'})

export class PostService {
  constructor(private http: HttpClient) {
  }

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDBUrl}/posts.json`, post)
      .pipe(
        map((response: CreateFbResponse) => {
          return {
            ...post,
            id: response.name,
            date: new Date(post.date)
          }
        })
      )
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDBUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id,
            date: new Date(post.date)
          }
        })
      )
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.fbDBUrl}/posts.json`)
      .pipe(
        map((response: GetFbResponse) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              date: new Date(response[key].date)
            }))
        })
      )
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDBUrl}/posts/${id}.json`)
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDBUrl}/posts/${post.id}.json`, post)
  }
}
