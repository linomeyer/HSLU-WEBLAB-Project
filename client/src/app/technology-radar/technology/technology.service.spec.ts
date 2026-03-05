import {TestBed} from '@angular/core/testing';
import {TechnologyService} from './technology.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {Technology, TechnologyCreateOrUpdate} from './technology';
import {expect, vi} from 'vitest';
import {firstValueFrom} from 'rxjs';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: any;

  const mockTechnologies: Technology[] = [
    {
      _id: '1',
      name: 'React',
      category: 'Languages & Frameworks',
      ring: 'Adopt',
      description: 'A JavaScript library',
      reason: 'Widely adopted',
      isPublished: true,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: '2',
      name: 'Docker',
      category: 'Tools',
      ring: 'Trial',
      description: 'Container platform',
      reason: 'Industry standard',
      isPublished: false,
      createdAt: new Date('2024-01-02')
    }
  ];

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });

    TestBed.configureTestingModule({
      providers: [
        TechnologyService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TechnologyService);

    const initialReq = httpMock.expectOne('/api/technology');
    initialReq.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
    consoleErrorSpy.mockRestore();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load technologies on initialization', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TechnologyService,
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      });

      const newHttpMock = TestBed.inject(HttpTestingController);
      const newService = TestBed.inject(TechnologyService);

      const req = newHttpMock.expectOne('/api/technology');
      req.flush(mockTechnologies);

      expect(newService.technologies()).toEqual(mockTechnologies);

      newHttpMock.verify();
    });

    it('should handle error during initial load', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TechnologyService,
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      });

      const newHttpMock = TestBed.inject(HttpTestingController);
      const newService = TestBed.inject(TechnologyService);

      const req = newHttpMock.expectOne('/api/technology');
      req.error(new ProgressEvent('error'));

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(newService.technologies()).toEqual([]);

      newHttpMock.verify();
    });
  });

  describe('getAll', () => {
    it('should return observable of technologies', async () => {
      const promise = firstValueFrom(service.getAll());

      const req = httpMock.expectOne('/api/technology');
      expect(req.request.method).toBe('GET');
      req.flush(mockTechnologies);

      const technologies = await promise;
      expect(technologies).toEqual(mockTechnologies);
    });

    it('should make GET request to correct endpoint', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne('/api/technology');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('post', () => {
    let newTechnology: TechnologyCreateOrUpdate;

    beforeEach(() => {
      newTechnology = {
        name: 'New Tech',
        category: 'Tools',
        ring: 'Assess',
        description: 'New technology',
        reason: 'Testing',
        isPublished: false
      };
    });

    it('should make POST request with correct data', async () => {
      const createdTech: TechnologyCreateOrUpdate = {
        ...newTechnology,
      };

      service.post(newTechnology);

      const req = httpMock.expectOne('/api/technology');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTechnology);
      req.flush(createdTech);
    });

    it('should update technologies signal after successful post', async () => {
      const createdTech: TechnologyCreateOrUpdate = {
        ...newTechnology
      };

      const initialCount = service.technologies().length;

      service.post(newTechnology);

      const req = httpMock.expectOne('/api/technology');
      req.flush(createdTech);

      await vi.waitFor(() => {
        expect(service.technologies().length).toBe(initialCount + 1);
        expect(service.technologies()).toContainEqual(createdTech);
      });
    });

    it('should handle post error', async () => {
      service.post(newTechnology);

      const req = httpMock.expectOne('/api/technology');
      req.error(new ProgressEvent('error'));

      await vi.waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
    });

    it('should not update signal on post error', async () => {
      const initialTechnologies = [...service.technologies()];

      service.post(newTechnology);

      const req = httpMock.expectOne('/api/technology');
      req.error(new ProgressEvent('error'));

      await vi.waitFor(() => {
        expect(service.technologies()).toEqual(initialTechnologies);
      });
    });
  });


  describe('put', () => {
    let updateData: TechnologyCreateOrUpdate;

    beforeEach(() => {
      service['_technologies'].set(mockTechnologies);

      updateData = {
        name: 'Updated React',
        category: 'Languages & Frameworks',
        ring: 'Hold',
        description: 'Updated description',
        reason: 'Updated reason',
        isPublished: true
      };
    });

    it('should make PUT request with correct data', async () => {
      const updatedTech: TechnologyCreateOrUpdate = {
        ...mockTechnologies[0],
        ...updateData
      };

      service.put('1', updateData);

      const req = httpMock.expectOne('/api/technology/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedTech);
    });

    it('should update technologies signal after successful put', async () => {
      const updatedTech: TechnologyCreateOrUpdate = {
        ...mockTechnologies[0],
        ...updateData
      };

      service.put('1', updateData);

      const req = httpMock.expectOne('/api/technology/1');
      req.flush(updatedTech);

      await vi.waitFor(() => {
        const tech = service.technologies().find(t => t._id === '1');
        expect(tech?.name).toBe('Updated React');
        expect(tech?.ring).toBe('Hold');
      });
    });

    it('should handle put error', async () => {
      service.put('1', updateData);

      const req = httpMock.expectOne('/api/technology/1');
      req.error(new ProgressEvent('error'));

      await vi.waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
    });

    it('should not update signal on put error', async () => {
      const initialTechnologies = [...service.technologies()];

      service.put('1', updateData);

      const req = httpMock.expectOne('/api/technology/1');
      req.error(new ProgressEvent('error'));

      await vi.waitFor(() => {
        expect(service.technologies()).toEqual(initialTechnologies);
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      service['_technologies'].set(mockTechnologies);
    });

    it('should make DELETE request to correct endpoint', async () => {
      const deletedTech = mockTechnologies[0];

      service.delete('1');

      const req = httpMock.expectOne('/api/technology/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(deletedTech);
    });

    it('should remove technology from signal after successful delete', async () => {
      const initialCount = service.technologies().length;

      service.delete('1');

      const req = httpMock.expectOne('/api/technology/1');
      req.flush(mockTechnologies[0]);

      await vi.waitFor(() => {
        expect(service.technologies().length).toBe(initialCount - 1);
        expect(service.technologies().find(t => t._id === '1')).toBeUndefined();
      });
    });

    it('should handle delete error', async () => {
      service.delete('1');

      const req = httpMock.expectOne('/api/technology/1');
      req.error(new ProgressEvent('error'));

      await vi.waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
    });

    it('should not update signal on delete error', async () => {
      const initialTechnologies = [...service.technologies()];

      service.delete('1');

      const req = httpMock.expectOne('/api/technology/1');
      req.error(new ProgressEvent('error'));

      await vi.waitFor(() => {
        expect(service.technologies()).toEqual(initialTechnologies);
      });
    });
  });
});
