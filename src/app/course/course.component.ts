import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {concat, forkJoin, fromEvent, Observable, scheduled} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap, throttleTime} from 'rxjs/operators';

import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { searchLessons } from '../../../server/search-lessons.route';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<any>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        const course$ = createHttpObservable(`/api/courses/${this.courseId}`);

        const lessons$ = this.loadLessons();

        //Envia um valor só, depois que terminar de completar as duas requisições do courses e lessons
        forkJoin([course$, lessons$])
        .pipe(
          tap(([course$, lessons$]) => {
            console.log("Course ",course$);
            console.log("Lessons ",lessons$);
          })
        )
        .subscribe()


    }

    ngAfterViewInit() {

       fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          throttleTime(500),

        ).subscribe();
    }


    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(
        `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(res => res["payload"])
        );
    }



}
