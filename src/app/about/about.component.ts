import { Component, OnInit } from '@angular/core';

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


  }
}

