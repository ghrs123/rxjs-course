import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {concat, fromEvent, Observable, scheduled} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';

import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { searchLessons } from '../../../server/search-lessons.route';


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

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

    }

    ngAfterViewInit() {


      this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          startWith(''),
          debounceTime(400), //retorna o valor depois de estar estável(exemplo parar de digitar) durante o tempo determinado de 400 ms
          distinctUntilChanged(), // remove a duplicidade de pedidos iguais
          switchMap( search => this.loadLessons(search))
        );
    }


    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(
        `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(res => res["payload"])
        );
    }



}
