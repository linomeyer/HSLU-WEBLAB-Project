import {Component} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'technology-radar',
  imports: [
    MatFabButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './technology-radar.component.html',
  styleUrl: './technology-radar.component.css',
})
export class TechnologyRadarComponent {

}
