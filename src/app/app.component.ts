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
  audioContext = new AudioContext()
  currentBuffer  = null
  constructor(db: AngularFireDatabase) {
    this.audiosFB = db.list('audio').valueChanges();
    this.audiosFB.subscribe((audios)=>{
      console.log(audios)
      this.audio = audios[this.getRandomInt(audios.length)]
      this.loadMusic(this.audio.url)
    })
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

loadMusic(url) {   
    var req = new XMLHttpRequest();
    req.open( "GET", url, true );
    req.responseType = "arraybuffer";   
    let th = this 
    req.onreadystatechange = function (e) {
          if (req.readyState == 4) {
             if(req.status == 200)
                  th.audioContext.decodeAudioData(req.response, 
                    function(buffer) {
                             this.currentBuffer = buffer;
                             //displayBuffer(buffer);
                    });
             else
                  alert('error during the load.Wrong url or cross origin issue');
          }
    } ;
    req.send();
}
}
