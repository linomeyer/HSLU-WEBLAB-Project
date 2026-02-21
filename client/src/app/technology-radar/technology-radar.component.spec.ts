import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TechnologyRadarComponent} from './technology-radar.component';
import {TechnologyService} from './technology/technology.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '@auth0/auth0-angular';
import {signal} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {Technology} from './technology/technology';
import {RadarPoint} from './radar-point';
import {TechnologyDetailComponent} from './technology/detail/technology-detail.component';
import {TechnologyEditModalComponent} from './technology/edit/technology-edit-modal.component';
import {expect, vi} from 'vitest';

describe('TechnologyRadarComponent', () => {
  let component: TechnologyRadarComponent;
  let fixture: ComponentFixture<TechnologyRadarComponent>;
  let mockTechnologyService: Partial<TechnologyService>;
  let mockDialog: Partial<MatDialog>;
  let mockAuthService: Partial<AuthService>;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;
  let technologiesSignal: any;

  const mockTechnologies: Technology[] = [
    {
      _id: '1',
      name: 'React',
      category: 'Languages & Frameworks',
      ring: 'Adopt',
      description: 'A JavaScript library for building user interfaces',
      reason: 'Widely adopted and maintained',
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      changedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      name: 'Docker',
      category: 'Tools',
      ring: 'Adopt',
      description: 'Container platform',
      reason: 'Industry standard',
      isPublished: true,
      createdAt: new Date('2024-01-02')
    },
    {
      _id: '3',
      name: 'Kubernetes',
      category: 'Platforms',
      ring: 'Trial',
      description: 'Container orchestration',
      reason: 'Growing adoption',
      isPublished: true,
      createdAt: new Date('2024-01-03'),
      changedAt: new Date('2024-01-20')
    },
    {
      _id: '4',
      name: 'TDD',
      category: 'Techniques',
      ring: 'Adopt',
      description: 'Test Driven Development',
      reason: 'Best practice',
      isPublished: true,
      createdAt: new Date('2024-01-04')
    },
    {
      _id: '5',
      name: 'Legacy Tool',
      category: 'Tools',
      ring: 'Hold',
      description: 'Old tool',
      reason: 'Deprecated',
      isPublished: false,
      createdAt: new Date('2023-01-01'),
      changedAt: new Date('2024-01-10')
    },
    {
      _id: '6',
      name: 'Angular',
      category: 'Languages & Frameworks',
      ring: 'Adopt',
      description: 'Web framework',
      reason: 'Enterprise ready',
      isPublished: true,
      createdAt: new Date('2024-01-05')
    }
  ];

  beforeEach(async () => {
    technologiesSignal = signal<Technology[]>(mockTechnologies);

    mockTechnologyService = {
      technologies: technologiesSignal.asReadonly()
    };

    mockDialog = {
      open: vi.fn()
    };

    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    mockAuthService = {
      isAuthenticated$: isAuthenticatedSubject.asObservable(),
      getAccessTokenSilently: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyRadarComponent],
      providers: [
        {provide: TechnologyService, useValue: mockTechnologyService},
        {provide: MatDialog, useValue: mockDialog},
        {provide: AuthService, useValue: mockAuthService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct constants', () => {
      expect(component.rings).toEqual(['Adopt', 'Trial', 'Assess', 'Hold']);
      expect(component.categories).toEqual(['Techniques', 'Tools', 'Platforms', 'Languages & Frameworks']);
      expect(component.ringRadii).toEqual([130, 250, 350, 440]);
      expect(component.center).toBe(480);
      expect(component.size).toBe(960);
    });

  });

  describe('radarPoints computed signal', () => {
    it('should filter and return only published technologies', () => {
      const points = component.radarPoints();

      expect(points.length).toBe(5);
      expect(points.every(p => p.technology.isPublished)).toBe(true);
      expect(points.find(p => p.id === '5')).toBeUndefined();
    });

    it('should transform technologies into RadarPoints with correct structure', () => {
      const points = component.radarPoints();

      points.forEach(point => {
        expect(point.id).toBeDefined();
        expect(point.name).toBeDefined();
        expect(point.x).toBeDefined();
        expect(point.y).toBeDefined();
        expect(point.color).toBeDefined();
        expect(point.technology).toBeDefined();
        expect(point.technology.createdAt).toBeDefined();
      });
    });

    it('should update when technologies signal changes', () => {
      const initialPoints = component.radarPoints();
      expect(initialPoints.length).toBe(5);

      const newTechnologies: Technology[] = [
        {
          _id: '7',
          name: 'New Tech',
          category: 'Tools',
          ring: 'Trial',
          description: 'New technology',
          reason: 'Testing',
          isPublished: true,
          createdAt: new Date('2024-02-01')
        }
      ];

      technologiesSignal.set(newTechnologies);
      fixture.detectChanges();

      const updatedPoints = component.radarPoints();
      expect(updatedPoints.length).toBe(1);
      expect(updatedPoints[0].name).toBe('New Tech');
      expect(updatedPoints[0].technology.createdAt).toBeDefined();
    });
  });

  describe('positionPoints logic', () => {

    it('should position points in different rings at different distances', () => {
      const points = component.radarPoints();

      // Calculate distance from center
      const getDistance = (point: RadarPoint) =>
        Math.sqrt(Math.pow(point.x - 480, 2) + Math.pow(point.y - 480, 2));

      const adoptPoint = points.find(p => p.technology.ring === 'Adopt');
      const trialPoint = points.find(p => p.technology.ring === 'Trial');

      if (adoptPoint && trialPoint) {
        const adoptDistance = getDistance(adoptPoint);
        const trialDistance = getDistance(trialPoint);

        expect(trialDistance).toBeGreaterThan(adoptDistance);
      }
    });

    it('should distribute multiple technologies in same category and ring', () => {
      const points = component.radarPoints();

      const reactPoint = points.find(p => p.name === 'React');
      const angularPoint = points.find(p => p.name === 'Angular');

      expect(reactPoint).toBeDefined();
      expect(angularPoint).toBeDefined();

      // at different positions
      expect(reactPoint?.x).not.toBe(angularPoint?.x);
      expect(reactPoint?.y).not.toBe(angularPoint?.y);
    });

    it('should filter out technologies with invalid categories', () => {
      const invalidTech: Technology = {
        _id: '99',
        name: 'Invalid',
        category: 'NonExistentCategory',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: true,
        createdAt: new Date('2024-02-01')
      };

      technologiesSignal.set([invalidTech]);
      fixture.detectChanges();

      const points = component.radarPoints();
      expect(points.length).toBe(0);
    });

    it('should filter out technologies with invalid rings', () => {
      const invalidTech: Technology = {
        _id: '99',
        name: 'Invalid',
        category: 'Tools',
        ring: 'NonExistentRing',
        description: 'Test',
        reason: 'Test',
        isPublished: true,
        createdAt: new Date('2024-02-01')
      };

      technologiesSignal.set([invalidTech]);
      fixture.detectChanges();

      const points = component.radarPoints();
      expect(points.length).toBe(0);
    });
  });

  describe('openDetail method', () => {
    let mockRadarPoint: RadarPoint;
    let mockDialogRef: Partial<MatDialogRef<any>>;

    beforeEach(() => {
      mockRadarPoint = {
        id: '1',
        name: 'React',
        x: 500,
        y: 300,
        color: '#b3588e',
        technology: mockTechnologies[0]
      };

      mockDialogRef = {
        close: vi.fn()
      };
      vi.mocked(mockDialog.open as any).mockReturnValue(mockDialogRef);
    });

    it('should open TechnologyDetailComponent for unauthenticated user', async () => {
      isAuthenticatedSubject.next(false);

      component.openDetail(mockRadarPoint);

      await vi.waitFor(() => {
        expect(mockDialog.open).toHaveBeenCalled();
      });

      expect(mockDialog.open).toHaveBeenCalledWith(
        TechnologyDetailComponent,
        {
          data: {
            technology: mockRadarPoint.technology,
            color: mockRadarPoint.color,
          },
          width: '500px',
        }
      );
    });

    it('should open TechnologyDetailComponent for authenticated non-admin user', async () => {
      isAuthenticatedSubject.next(true);

      // Mock JWT token without admin role
      const nonAdminToken = 'header.' + btoa(JSON.stringify({
        sub: 'user123',
        'https://technology-radar.com/roles': ['user']
      })) + '.signature';

      vi.mocked(mockAuthService.getAccessTokenSilently as any).mockReturnValue(of(nonAdminToken));

      component.openDetail(mockRadarPoint);

      await vi.waitFor(() => {
        expect(mockDialog.open).toHaveBeenCalled();
      });

      expect(mockDialog.open).toHaveBeenCalledWith(
        TechnologyDetailComponent,
        {
          data: {
            technology: mockRadarPoint.technology,
            color: mockRadarPoint.color,
          },
          width: '500px',
        }
      );
    });

    it('should open TechnologyEditModalComponent for authenticated admin user', async () => {
      isAuthenticatedSubject.next(true);

      // Mock JWT token with admin role
      const adminToken = 'header.' + btoa(JSON.stringify({
        sub: 'admin123',
        'https://technology-radar.com/roles': ['admin']
      })) + '.signature';

      vi.mocked(mockAuthService.getAccessTokenSilently as any).mockReturnValue(of(adminToken));

      component.openDetail(mockRadarPoint);

      await vi.waitFor(() => {
        expect(mockDialog.open).toHaveBeenCalled();
      });

      expect(mockDialog.open).toHaveBeenCalledWith(
        TechnologyEditModalComponent,
        {
          data: mockRadarPoint.technology,
          width: '600px',
          disableClose: false
        }
      );
    });
  });
  describe('Template rendering', () => {
    it('should render SVG element', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.getAttribute('viewBox')).toBe('0 0 960 960');
    });

    it('should render ring circles', () => {
      const circles = fixture.nativeElement.querySelectorAll('circle[stroke="#ccc"]');
      expect(circles.length).toBeGreaterThanOrEqual(4); // At least 4 ring circles
    });

    it('should render quadrant divider lines', () => {
      const lines = fixture.nativeElement.querySelectorAll('line[stroke="#ccc"]');
      expect(lines.length).toBeGreaterThanOrEqual(2); // Horizontal and vertical lines
    });

    it('should render quadrant labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('.quadrant-label');
      expect(labels.length).toBe(4);

      const labelTexts = Array.from(labels).map((el: any) => el.textContent.trim());
      expect(labelTexts).toContain('Techniques >');
      expect(labelTexts).toContain('Tools >');
      expect(labelTexts).toContain('Platforms >');
      expect(labelTexts).toContain('Languages & Frameworks >');
    });

    it('should render ring labels', () => {
      const ringLabels = fixture.nativeElement.querySelectorAll('.ring-label');
      expect(ringLabels.length).toBe(4);

      const ringTexts = Array.from(ringLabels).map((el: any) => el.textContent.trim());
      expect(ringTexts).toContain('Adopt');
      expect(ringTexts).toContain('Trial');
      expect(ringTexts).toContain('Assess');
      expect(ringTexts).toContain('Hold');
    });

    it('should render radar points for published technologies', () => {
      const radarPoints = fixture.nativeElement.querySelectorAll('.radarpoint');
      expect(radarPoints.length).toBe(5);
    });
  });
});
