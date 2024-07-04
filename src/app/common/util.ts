import { signal } from "@angular/core";
import { Observable } from "rxjs";

export function createHttpObservable(url:string) {

  return  new Observable((observable) => {

    const controller = new AbortController();
    const signal = controller.signal;

    //fetch é um promise, quando a aplicação iniciar o fetch já é chamado
    fetch(url, {signal})
      .then((response) => {
        if(response.ok) {

        //payload
        return response.json();

        }
        else {
          observable.error("Request failed with status code: " + response.status);
        }
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

