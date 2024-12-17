import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'display-sound',
  templateUrl: './display-sound.component.html',
  styleUrls: ['./display-sound.component.css']
})
export class DisplaySoundComponent implements OnChanges {
  @Input() playSound: boolean = true;

  urlPlaySoundPictureOn: string = "../../../../../../assets/images/dashFichaTecnica/sonido_on.png";
  urlPlaySoundPictureOff: string = "../../../../../../assets/images/dashFichaTecnica/sonido_off.png";
  currentSoundPicture: string = '';
  soundTextInformation: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    const playSoundChanges = changes['playSound'];
    if(playSoundChanges) {
      this.currentSoundPicture = playSoundChanges.currentValue ? this.urlPlaySoundPictureOn : this.urlPlaySoundPictureOff;
      this.soundTextInformation = playSoundChanges.currentValue ? 'Sonido activado' : 'Sonido desactivado';
    }
  }
}
