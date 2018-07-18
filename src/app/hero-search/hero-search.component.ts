import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Observable, Subject } from 'rxjs';
import { Hero } from '../hero';
import { debounceTime, distinct, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  public heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering a term.
      debounceTime(300),

      // igonre new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes.
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

  public search(term: string): void {
    this.searchTerms.next(term);
  }

}
