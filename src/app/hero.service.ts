import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessagesService } from '../messages.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messages: MessagesService) { }

  getHeroes(): Observable<Hero[]> {
    this.messages.add('HeroService: fetched heroes');
    return of(HEROES);
  }

}