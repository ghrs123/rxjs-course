import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Course } from "../model/course";
import { tap, map } from "rxjs/operators";
import { createHttpObservable } from "./util";

@Injectable({
  providedIn: 'root'
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$ : Observable<Course[]> = this.subject.asObservable();


  init() {

    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(

        tap(() => console.log("HTTP request executed")),
        map(res => Object.values(res["payload"]) ),

      ).subscribe(

        courses => this.subject.next(courses)

      );
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory('ADVANCED');
  }

  filterByCategory(category: string) {
    return this.courses$
    .pipe(
        map(courses => courses
            .filter(course => course.category == category))
    );
  }

}
