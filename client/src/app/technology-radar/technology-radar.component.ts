import {Component, computed, inject} from '@angular/core';
import {TechnologyService} from './technology/technology.service';
import {MatDialog} from '@angular/material/dialog';
import {RadarPoint} from './radar-point'
import {Technology} from './technology/technology';
import {TechnologyDetailComponent} from './technology/detail/technology-detail.component';
import {MatTooltip} from '@angular/material/tooltip';
import {AuthService} from '@auth0/auth0-angular';

const CATEGORIES = ['Techniques', 'Tools', 'Platforms', 'Languages & Frameworks'];
const RINGS = ['Adopt', 'Trial', 'Assess', 'Hold'];
const RING_RADII = [130, 250, 350, 440];
const RADAR_SIZE = 960;
const CENTER = RADAR_SIZE / 2;

const CATEGORY_COLORS: Record<string, string> = {
  'Techniques': '#1ebccd',
  'Tools': '#86b782',
  'Platforms': '#c9a857',
  'Languages & Frameworks': '#b3588e',
};

const QUADRANT_ANGLES: Record<string, { start: number; end: number }> = {
  'Techniques': {start: 180, end: 270},
  'Tools': {start: 270, end: 360},
  'Platforms': {start: 90, end: 180},
  'Languages & Frameworks': {start: 0, end: 90},
};

@Component({
  selector: 'app-technology-radar',
  imports: [
    MatTooltip
  ],
  templateUrl: './technology-radar.component.html',
  styleUrl: './technology-radar.component.css',
})
export class TechnologyRadarComponent {
  private techService = inject(TechnologyService);
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);


  radarPoints = computed(() => {
    const published = this.techService.technologies().filter((t) => t.isPublished);
    return this.positionPoints(published);
  });

  rings = RINGS;
  ringRadii = RING_RADII;
  categories = CATEGORIES;
  categoryColors = CATEGORY_COLORS;
  center = CENTER;
  size = RADAR_SIZE;

  /**
   * Opens the detail modal for a technology.
   * Admins will see an Edit button in the detail modal that brings them to the edit modal.
   */
  openDetail(radarPoint: RadarPoint): void {
    this.dialog.open(TechnologyDetailComponent, {
      data: {
        technology: radarPoint.technology,
        color: radarPoint.color,
      },
      width: '500px',
    });
  }

  private positionPoints(technologies: Technology[]): RadarPoint[] {
    return technologies.map((tech) => {
      const quadrant = QUADRANT_ANGLES[tech.category];
      if (!quadrant) return null;
      const ringIndex = RINGS.indexOf(tech.ring);
      if (ringIndex === -1) return null;

      // Count how many items come before this one in the same category + ring
      const siblings = technologies.filter(
        (t) => t.category === tech.category && t.ring === tech.ring
      );
      const indexInSegment = siblings.indexOf(tech);
      const total = siblings.length;

      // spread the sibling points along the quadrant of the circle
      const angleDeg =
        quadrant.start + ((quadrant.end - quadrant.start) / (total + 1)) * (indexInSegment + 1);
      const angleRad = (angleDeg * Math.PI) / 180;

      // Alternate between inner and outer half of circle so the points dont overlap
      const innerRadius = ringIndex === 0 ? 30 : RING_RADII[ringIndex - 1] + 15;
      const outerRadius = RING_RADII[ringIndex] - 15;
      const midRadius = (innerRadius + outerRadius) / 2;
      const radius = indexInSegment % 2 === 0
        ? (innerRadius + midRadius) / 2
        : (midRadius + outerRadius) / 2;

      return {
        id: tech._id,
        name: tech.name,
        x: CENTER + radius * Math.cos(angleRad),
        y: CENTER + radius * Math.sin(angleRad),
        color: CATEGORY_COLORS[tech.category] || '#999',
        technology: tech,
      };
    }).filter((p): p is RadarPoint => p !== null);
  }
}
