import { signal } from "@angular/core";
import { Observable } from "rxjs";

export function createHttpObservable(url:string) {

  return  Observable.create((observable) => {

    const controller = new AbortController();
    const signal = controller.signal;

    //fetch é um promise, quando a aplicação iniciar o fetch já é chamado
    fetch(url, {signal})
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

      return () => controller.abort();
  });

}

