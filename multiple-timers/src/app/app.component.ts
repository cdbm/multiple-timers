import { Component } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'multiple-timers';

  timers = new Map();
  timerIds = this.getLocalStorge("timerIds") ? JSON.parse(this.getLocalStorge("timerIds")) : [];
  id = 0;

  ngOnInit(){

    this.timerIds.forEach(timerId => {
      this.start_timer( parseInt(this.getLocalStorge(timerId)) , timerId);
      this.id = timerId + 1;
    })

  }

  start_timer(start = 60, id = this.id){

    var t = timer(100, 1000).pipe(
            map(i => start - i),
            take(start + 1)
            );

    const timerObject = {
      id : id,
      timer : t
    }
          
    this.timers.set(timerObject.id,timerObject);
    this.timerIds[timerObject.id] = timerObject.id;

    this.setLocalStorage("timerIds", JSON.stringify(this.timerIds));
    this.setLocalStorage(timerObject.id, start);                          
    
    t.subscribe(val => {
      this.setLocalStorage(timerObject.id, val);
    })

    this.id++;
  }

  getLocalStorge(key){
    return localStorage.getItem(key.toString());
  }

  setLocalStorage(key, value){
    localStorage.setItem(key.toString(), value.toString());
  }
}
