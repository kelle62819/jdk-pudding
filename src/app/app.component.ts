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
  audiosFB: Observable<any[]>;
  audio: any
  url: string
  constructor(db: AngularFireDatabase) {
    this.audiosFB = db.list('audio').valueChanges();
    this.audiosFB.subscribe((audios)=>{
      console.log(audios)
      this.audio = audios[this.getRandomInt(audios.length)]
    })
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
