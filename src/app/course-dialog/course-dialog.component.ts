import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { fromPromise } from 'rxjs/internal-compatibility';
import { filter, concatMap, exhaustMap, takeLast, map, take } from 'rxjs/operators';

import { Course } from '../model/course';
import { fromEvent, interval } from 'rxjs';

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  //@ViewChild("saveButton", { static: true }) saveButton: ElementRef;


  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private saveButton: ElementRef
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap(changes => this.saveCourse(changes))
      ).subscribe();
  }

  saveCourse(changes: any) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      }));

  }

  ngAfterViewInit() {
    fromEvent(this.saveButton.nativeElement, 'click')
    .pipe(
      exhaustMap(() => this.saveCourse(this.form.value))
    )
    .subscribe()

  }

  close() {
    this.dialogRef.close();
  }

  save() {}
}
