import { Component, ViewChild, ElementRef } from '@angular/core';
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
  audioObj: any 
  audioContext = new AudioContext()
  imgIdx:number = 0
  images: any[] = [
    {src: "/assets/0.jpg"},
    {src: "/assets/1.jpg"},
    {src: "/assets/2.jpg"},
    {src: "/assets/3.jpg"},
    {src: "/assets/4.jpg"},
    {src: "/assets/5.jpg"},
  ]
  @ViewChild('player', {static: false}) player:ElementRef
  @ViewChild('anim', {static: false}) anim:ElementRef
  constructor(db: AngularFireDatabase) {
    this.audiosFB = db.list('audio').valueChanges();
    this.audiosFB.subscribe((audios)=>{
      this.audio = audios[this.getRandomInt(audios.length)]
      this.audioContext.createMediaElementSource(this.player.nativeElement)
    })
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  wisdom(){
    this.player.nativeElement.play()
    let index = 0;
    setInterval(()=>{
        if(index<this.audio.wave.length){
          let calc = Math.round(this.audio.wave[index]*4)
          if(calc > 4)
           calc = 4
          this.imgIdx = calc
          index++
        }
    },100)
  }
}
