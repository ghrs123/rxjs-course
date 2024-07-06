import { Observable } from 'rxjs';
import { Course } from '../model/course';

export function createHttpObservable(url:string):Observable<Course[]> {

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

