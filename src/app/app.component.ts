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
  imgs = new Array();
  @ViewChild('player', {static: false}) player:ElementRef
  @ViewChild('anim', {static: false}) anim:ElementRef
  constructor(db: AngularFireDatabase) {
    this.pload('/assets/0.jpg','/assets/1.jpg','/assets/2.jpg','/assets/3.jpg','/assets/4.jpg')
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
  pload(...args: any[]):void {
    for (var i = 0; i < args.length; i++) {
      this.imgs[i] = new Image();
      this.imgs[i].src = args[i];
      console.log('loaded: ' + args[i]);
    }
  }
}
