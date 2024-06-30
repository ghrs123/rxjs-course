import { Component, OnInit } from '@angular/core';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, map, shareReplay, tap } from 'rxjs/operators';

import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;


    ngOnInit() {

      let url:string  = "/api/courses";
      const http$ = createHttpObservable(url);

      const courses$: Observable<Course[]> = http$
      .pipe(
        catchError(err => {
          console.log("Error occurred ", err)

          return throwError(err);
        }),
        finalize(() => {

        }),
        tap(() => console.log("HRRP request executed")),
        map( res => Object.values(res["payload"])),
        shareReplay(),
      );

      this.beginnerCourses$ = courses$
      .pipe(
        map(courses => courses
            .filter(course => course.category == 'BEGINNER'))
      );

      this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses
            .filter(course => course.category == 'ADVANCED'))
      );

    }

}
