import { Component } from '@angular/core';
import { timer, Subscription } from 'rxjs';
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
  id = 1;

  ngOnInit(){

    this.timerIds.forEach(timerId => {
      this.start_timer( parseInt(this.getLocalStorge(timerId)) , timerId);
      this.id = timerId + 1;
    })

  }

  delete_timer(timerId){
    this.timerIds.forEach((element, index) => {
      if(element == timerId) this.timerIds.splice(index, 1);
    });

    this.setLocalStorage("timerIds", JSON.stringify(this.timerIds));

    this.timers.get(timerId).subscription.unsubscribe();
    this.timers.delete(timerId);
    this.deleteLocalStorage(timerId);

    if(this.timerIds.length == 0) {
      this.id = 1;
    }

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

    var subscription = t.subscribe(val => {
      this.setLocalStorage(timerObject.id, val);
    })

    timerObject["subscription"] = subscription;
    
    if(!this.timers.has(timerObject.id) && !this.timerIds.find(element => element == timerObject.id)){
      this.timerIds.push(timerObject.id)
    }

    this.timers.set(timerObject.id,timerObject);
    this.setLocalStorage("timerIds", JSON.stringify(this.timerIds));
    this.setLocalStorage(timerObject.id, start);                          

    this.id++;
  }

  getLocalStorge(key){
    return localStorage.getItem(key.toString());
  }

  setLocalStorage(key, value){
    localStorage.setItem(key.toString(), value.toString());
  }

  deleteLocalStorage(key){
    localStorage.removeItem(key.toString());
  }
}
