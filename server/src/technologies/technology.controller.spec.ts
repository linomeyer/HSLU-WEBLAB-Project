import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technology, TechnologySchema } from './technology.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/test-database.module';
import {
  singleTechnology,
  testTechnologies,
} from '../test-utils/technology.data';
import { TechnologyDto } from './dtos/technology.dto';
import { ConfigService } from '@nestjs/config';

describe('TechnologyController', () => {
  let controller: TechnologyController;
  let technologyModel: Model<Technology>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Technology.name, schema: TechnologySchema },
        ]),
      ],
      controllers: [TechnologyController],
      providers: [
        TechnologyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AUTH0_ROLES_CLAIM') {
                return 'https://example.com/roles';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<TechnologyController>(TechnologyController);
    technologyModel = module.get<Model<Technology>>(
      getModelToken(Technology.name),
    );
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  beforeEach(async () => {
    await technologyModel.deleteMany({});
  });

  afterEach(async () => {
    await technologyModel.deleteMany({});
  });

  describe('findAll', () => {
    it('should return an empty array when no technologies exist', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });

    it('should return all technologies', async () => {
      await technologyModel.insertMany(testTechnologies);

      const result = await controller.findAll();

      expect(result).toHaveLength(6);
      expect(result[0].name).toBe('React');
      expect(result[1].name).toBe('Angular');
    });

    it('should return only published technologies when filtered', async () => {
      await technologyModel.insertMany(testTechnologies);

      const published = testTechnologies.filter((t) => t.isPublished);
      const result = await controller.findAll();
      const publishedResult = result.filter((t) => t.isPublished);

      expect(publishedResult).toHaveLength(published.length);
    });
  });

  describe('findOne', () => {
    it('should return a single technology by id', async () => {
      const created = await technologyModel.create(singleTechnology);

      const result = await controller.findOne(created._id.toString());

      expect(result).not.toBeNull();
      expect(result.name).toBe('Vue.js');
      expect(result.category).toBe('Languages & Frameworks');
    });

    it('should throw an error when technology not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format

      await expect(controller.findOne(fakeId)).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new technology', async () => {
      const newTech = {
        name: 'TypeScript',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'Typed superset of JavaScript',
        reason: 'TypeScript is a type safe',
        isPublished: true,
      };

      const result = await controller.create(newTech as TechnologyDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('TypeScript');
      expect(result._id).toBeDefined();

      const found = await technologyModel.findById(result._id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('TypeScript');
    });

    describe('update', () => {
      it('should update an existing technology', async () => {
        const created = await technologyModel.create(singleTechnology);

        const updateData = {
          name: 'Vue.js 3',
          ring: 'Trial',
          description: 'Updated description',
        };

        const result = await controller.update(
          created._id.toString(),
          updateData as TechnologyDto,
        );

        expect(result).not.toBeNull();
        expect(result.name).toBe('Vue.js 3');
        expect(result.ring).toBe('Trial');
        expect(result.description).toBe('Updated description');
        expect(result.category).toBe('Languages & Frameworks'); // Unchanged
      });

      it('should update the changedAt timestamp', async () => {
        const created = await technologyModel.create(singleTechnology);
        const originalDate = created.changedAt;

        // Wait so timestamp is different
        await new Promise((resolve) => setTimeout(resolve, 10));

        const result = await controller.update(created._id.toString(), {
          description: 'New description',
        } as TechnologyDto);

        expect(result).not.toBeNull();
        expect(result.changedAt.getTime()).toBeGreaterThan(
          originalDate.getTime(),
        );
      });
    });

    describe('delete', () => {
      it('should delete a technology', async () => {
        const created = await technologyModel.create(singleTechnology);

        await controller.delete(created._id.toString());

        const found = await technologyModel.findById(created._id);
        expect(found).toBeNull();
      });

      it('should throw an error when deleting non-existent technology', async () => {
        const fakeId = '507f1f77bcf86cd799439011';

        await expect(controller.delete(fakeId)).rejects.toThrow();
      });
    });

    describe('complex queries', () => {
      beforeEach(async () => {
        await technologyModel.insertMany(testTechnologies);
      });

      it('should filter technologies by category', async () => {
        const allTechs = await controller.findAll();
        const frameworks = allTechs.filter(
          (t) => t.category === 'Languages & Frameworks',
        );

        expect(frameworks).toHaveLength(2);
        expect(
          frameworks.every((t) => t.category === 'Languages & Frameworks'),
        ).toBe(true);
      });

      it('should filter technologies by ring', async () => {
        const allTechs = await controller.findAll();
        const adoptTechs = allTechs.filter((t) => t.ring === 'Adopt');

        expect(adoptTechs).toHaveLength(3);
        expect(adoptTechs.every((t) => t.ring === 'Adopt')).toBe(true);
      });

      it('should count technologies correctly', async () => {
        const count = await technologyModel.countDocuments();
        expect(count).toBe(6);
      });
    });
  });
});
