import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Course } from "../model/course";
import { tap, map, filter } from "rxjs/operators";
import { createHttpObservable } from "./util";
import { fromPromise } from "rxjs/internal-compatibility";
import { BrowserModule } from '@angular/platform-browser';

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


  selectById(courseId: number): Observable<Course> {
    return this.courses$.pipe(
       map(courses  => courses.find( course => course.id == courseId)),
       filter(course => !!course)
     );
   }


  filterByCategory(category: string) {
    return this.courses$
    .pipe(
        map(courses => courses
            .filter(course => course.category == category))
    );
  }

  saveCourse(courseId: number, changes) {

     const courses = this.subject.getValue();

     const courseindex = courses.findIndex(course => course.id == courseId);

     const newCourses = courses.slice(0);

     newCourses[courseindex] = {
      ...courses[courseindex],
      ...changes
     };

     this.subject.next(newCourses);

     return fromPromise(
        fetch(`/api/courses/${courseId}`, {
          method: 'PUT',
          body: JSON.stringify(changes),
          headers: {
            'content-type' : 'application/json'
          }
        })
      );
  }

}
