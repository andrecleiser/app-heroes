import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessagesService } from '../messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private messageService: MessagesService,
    private http: HttpClient) { }


  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError('getHeros', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(() => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<Hero>('updateErro'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(newHero => this.log(`Adicionado id: ${newHero.id} name: ${newHero.name}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(() => this.log(`Excluído id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  public searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    } else {
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(() => this.log(`found heros matching "${term}" `)),
        catchError(this.handleError<Hero[]>('Search heroes', []))
      );
    }

  }
}
