import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {AuthService} from '@auth0/auth0-angular';
import {provideRouter, Router} from '@angular/router';
import {BehaviorSubject, of} from 'rxjs';
import {expect, vi} from 'vitest';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideLocationMocks} from '@angular/common/testing';
import {Component} from '@angular/core';

@Component({template: '', standalone: true})
class DummyComponent {
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: any;
  let router: Router;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;
  let getAccessTokenSilentlySpy: any;

  beforeEach(async () => {
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    getAccessTokenSilentlySpy = vi.fn().mockReturnValue(of('default-token'));

    mockAuthService = {
      isAuthenticated$: isAuthenticatedSubject.asObservable(),
      getAccessTokenSilently: getAccessTokenSilentlySpy,
      loginWithRedirect: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        provideRouter([
          {path: 'technology-radar', component: DummyComponent},
          {path: 'administration', component: DummyComponent},
          {path: 'auth', component: DummyComponent},
          {path: '**', component: DummyComponent}
        ]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize isAdmin signal with false', () => {
      expect(component.isAdmin()).toBe(false);
    });

    it('should have auth service injected', () => {
      expect(component['auth']).toBeDefined();
    });

    it('should have router injected', () => {
      expect(component['router']).toBeDefined();
    });
  });

  describe('isAdmin signal', () => {
    it('should be false when user is not authenticated', async () => {
      isAuthenticatedSubject.next(false);
      await fixture.whenStable();

      expect(component.isAdmin()).toBe(false);
    });

    it('should be false when user is authenticated but not admin', async () => {
      const nonAdminToken = 'header.' + btoa(JSON.stringify({
        sub: 'user123',
        'https://technology-radar.com/roles': ['user']
      })) + '.signature';

      getAccessTokenSilentlySpy.mockReturnValue(of(nonAdminToken));

      isAuthenticatedSubject.next(true);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isAdmin()).toBe(false);
    });

    it('should be true when user is authenticated and is admin', async () => {
      const adminToken = 'header.' + btoa(JSON.stringify({
        sub: 'admin123',
        'https://technology-radar.com/roles': ['admin']
      })) + '.signature';

      getAccessTokenSilentlySpy.mockReturnValue(of(adminToken));

      isAuthenticatedSubject.next(true);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isAdmin()).toBe(true);
    });
  });

  describe('goToAdministration', () => {
    it('should navigate to administration when user is authenticated', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      isAuthenticatedSubject.next(true);

      component.goToAdministration();

      expect(navigateSpy).toHaveBeenCalledWith(['/administration']);
    });

    it('should call loginWithRedirect when user is not authenticated', () => {
      isAuthenticatedSubject.next(false);

      component.goToAdministration();

      expect(mockAuthService.loginWithRedirect).toHaveBeenCalledWith({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/administration`
        }
      });
    });
  });

  describe('handleProfileClick', () => {
    it('should navigate to auth when user is authenticated', () => {
      const navigateSpy = vi.spyOn(router, 'navigateByUrl');
      isAuthenticatedSubject.next(true);

      component.handleProfileClick();

      expect(navigateSpy).toHaveBeenCalledWith('/auth');
    });

    it('should call loginWithRedirect when user is not authenticated', () => {
      isAuthenticatedSubject.next(false);

      component.handleProfileClick();

      expect(mockAuthService.loginWithRedirect).toHaveBeenCalledWith({
        appState: {target: '/auth'}
      });
    });
  });

  describe('Template rendering', () => {
    it('should render navbar element', () => {
      const navbar = fixture.nativeElement.querySelector('.navbar');
      expect(navbar).toBeTruthy();
    });

    it('should render navbar title', () => {
      const title = fixture.nativeElement.querySelector('.navbar-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Technology Radar');
    });

    it('should have routerLink on title', () => {
      const titleRouterLink = fixture.nativeElement.querySelector('.navbar-title').getAttribute('routerlink');
      expect(titleRouterLink).toBe('/technology-radar');
    });

    it('should render administration button', () => {
      const adminButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Administration')) as HTMLElement;

      expect(adminButton).toBeTruthy();
      expect(adminButton.classList.contains('admin-button')).toBe(true);
    });

    it('should render lock icon in administration button', () => {
      const adminButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Administration')) as HTMLElement;

      const icon = adminButton.querySelector('mat-icon');
      expect(icon).toBeTruthy();
      expect(icon?.textContent).toBe('lock');
    });

    it('should render profile button', () => {
      const profileButton = fixture.nativeElement.querySelector('.profile-button');
      expect(profileButton).toBeTruthy();
    });

    it('should render person icon in profile button', () => {
      const profileButton = fixture.nativeElement.querySelector('.profile-button');
      const icon = profileButton.querySelector('mat-icon');

      expect(icon).toBeTruthy();
      expect(icon?.textContent).toBe('person');
    });

    it('should add admin-active class when user is admin', async () => {
      const adminToken = 'header.' + btoa(JSON.stringify({
        sub: 'admin123',
        'https://technology-radar.com/roles': ['admin']
      })) + '.signature';

      getAccessTokenSilentlySpy.mockReturnValue(of(adminToken));

      isAuthenticatedSubject.next(true);

      await fixture.whenStable();
      fixture.detectChanges();

      const adminButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Administration')) as HTMLElement;

      expect(adminButton.classList.contains('admin-active')).toBe(true);
    });

    it('should not add admin-active class when user is not admin', async () => {
      isAuthenticatedSubject.next(false);

      await fixture.whenStable();
      fixture.detectChanges();

      const adminButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Administration')) as HTMLElement;

      expect(adminButton.classList.contains('admin-active')).toBe(false);
    });

    it('should render navbar-actions container', () => {
      const actions = fixture.nativeElement.querySelector('.navbar-actions');
      expect(actions).toBeTruthy();
    });

    it('should render navbar-content container', () => {
      const content = fixture.nativeElement.querySelector('.navbar-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Button interactions', () => {
    it('should call goToAdministration when admin button is clicked', () => {
      const spy = vi.spyOn(component, 'goToAdministration');

      const adminButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Administration')) as HTMLElement;

      adminButton.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should call handleProfileClick when profile button is clicked', () => {
      const spy = vi.spyOn(component, 'handleProfileClick');

      const profileButton = fixture.nativeElement.querySelector('.profile-button');
      profileButton.click();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Authentication state changes', () => {
    it('should update isAdmin when authentication state changes from false to true', async () => {
      isAuthenticatedSubject.next(false);
      await fixture.whenStable();
      expect(component.isAdmin()).toBe(false);

      const adminToken = 'header.' + btoa(JSON.stringify({
        sub: 'admin123',
        'https://technology-radar.com/roles': ['admin']
      })) + '.signature';

      getAccessTokenSilentlySpy.mockReturnValue(of(adminToken));

      isAuthenticatedSubject.next(true);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isAdmin()).toBe(true);
    });

    it('should update isAdmin when user logs out', async () => {
      const adminToken = 'header.' + btoa(JSON.stringify({
        sub: 'admin123',
        'https://technology-radar.com/roles': ['admin']
      })) + '.signature';

      getAccessTokenSilentlySpy.mockReturnValue(of(adminToken));

      isAuthenticatedSubject.next(true);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isAdmin()).toBe(true);

      isAuthenticatedSubject.next(false);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isAdmin()).toBe(false);
    });
  });
});
