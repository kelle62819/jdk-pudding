import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pudding';
  audio: Observable<any>;
  url: string
  constructor(db: AngularFireDatabase) {
    this.audio = db.object('audio').valueChanges();
    this.audio.subscribe((url)=>{
      console.log(url)
      this.url = url
    })
  }
}
