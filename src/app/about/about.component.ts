import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval, noop, observable, Observable, timer } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    //$ declare that the variable is a observable type
    //const interval$ = interval(1000);
    /*const interval$ = timer(3000, 1000);

    const sub = interval$.subscribe(val => console.log("stream 1 => " + val));

    setTimeout( () => sub.unsubscribe() , 5000);

    const click = fromEvent(document, 'click');

    click.subscribe(
      evt => console.log(evt),
      err => console.log(err),
      () => console.log("Completed")
    );
    */

    //Promise: já é chamado na hora, faz a ação
    //Observable: só é ativo quando for chamado, faz ação quando for chamado

    const http$ = Observable.create((observable) => {
      //fetch é um promise, quando a aplicação iniciar o fetch já é chamado
      fetch("/api/courses")
        .then((response) => {

          //payload
          return response.json();
        })
        .then((body) => {

          //emit the body in observable
          observable.next(body);

          observable.complete();

        })
        .catch((err) => {

          observable.error(err);

        });
    });


    http$.subscribe(
      courses => console.log(courses),
      noop, // ou () => {} - como não está se esperar nenhum erro
      () => console.log("Completed")

    );
  }
}
