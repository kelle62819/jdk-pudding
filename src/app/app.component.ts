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
  read: any[] = []
  imgCnt:number = 11
  audios: any[]
  listenerAdded:boolean = false
  timer:any
  fullAudios: any[]
  lang: string;
  @ViewChild('player', {static: false}) player:ElementRef
  @ViewChild('anim', {static: false}) anim:ElementRef
  constructor(private db: AngularFireDatabase) {
    this.lang = navigator.language.slice(0,2).toUpperCase(); 
    if(this.lang != "FR")
      this.lang = "EN"
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
    this.initAudio()
  }
  initAudio(){
    this.audiosFB = this.db.list('audio/'+this.lang).valueChanges();
    this.audiosFB.subscribe((audios)=>{
      if(audios && audios.length){
        this.fullAudios = audios
        this.audios = JSON.parse(JSON.stringify(audios))
        this.cleanRead()
        this.newWisdom()
      }
    })    
  }
  newWisdom(){
    if(this.audios.length == 0)
      this.audios = JSON.parse(JSON.stringify(this.fullAudios))
    if(this.timer)
     clearInterval(this.timer)
    this.audio = this.audios.splice(this.getRandomInt(this.audios.length),1)[0]
    if(this.player && this.player.nativeElement){
      this.player.nativeElement.pause()
    }
    if(!this.listenerAdded)
      setTimeout(()=>{
        this.listenerAdded = true
        this.player.nativeElement.addEventListener('ended', this.newWisdom.bind(this))
      })
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  wisdom(){
    this.player.nativeElement.play()
    this.read.push(this.audio.id)
    localStorage.setItem('read'+this.lang,JSON.stringify(this.read))
    let index = 0;
    this.timer = setInterval(()=>{
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
    }
  }
  cleanRead(){
    let readItems = localStorage.getItem('read' + this.lang)
    if(readItems){
      this.read = JSON.parse(readItems)
      this.audios = this.audios.filter((audio)=>{
        return this.read.indexOf(audio.id) == -1
      })
    }
  }
  changeLang(lang: string){
    this.lang = lang
    this.initAudio()
  }
}