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
  read: any[]
  imgCnt:number = 11
  @ViewChild('player', {static: false}) player:ElementRef
  @ViewChild('anim', {static: false}) anim:ElementRef
  constructor(db: AngularFireDatabase) {
    
    this.pload('/assets/pic0.png',
    '/assets/pic1.png',
    '/assets/pic2.png',
    '/assets/pic3.png',
    '/assets/pic4.png',
    '/assets/pic5.png',
    '/assets/pic6.png',
    '/assets/pic7.png',
    '/assets/pic8.png',
    '/assets/pic9.png',
    '/assets/pic10.png')
    this.audiosFB = db.list('audio').valueChanges();
    this.audiosFB.subscribe((audios)=>{
      this.cleanRead(audios)
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
          let calc = Math.round(this.audio.wave[index]*8)+2
          if(calc > 8)
           calc = 8
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
  cleanRead(audios){
    let readItems = localStorage.getItem('dataSource')
    if(readItems){
      console.log("found", readItems)
    }

  }
}