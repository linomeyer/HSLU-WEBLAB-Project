import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyService } from './technology.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technology, TechnologySchema } from './technology.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/test-database.module';
import { testTechnologies } from '../test-utils/technology.data';
import { TechnologyDto } from './dtos/technology.dto';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let technologyModel: Model<Technology>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Technology.name, schema: TechnologySchema },
        ]),
      ],
      providers: [TechnologyService],
    }).compile();

    service = module.get<TechnologyService>(TechnologyService);
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all technologies', async () => {
      await technologyModel.insertMany(testTechnologies);

      const result = await service.findAll();

      expect(result).toHaveLength(6);
    });
  });

  describe('findOne', () => {
    it('should find a technology by id', async () => {
      const created = await technologyModel.create(testTechnologies[0]);

      const result = await service.findOne(created._id.toString());

      expect(result).toBeDefined();
      expect(result?.name).toBe('React');
    });
  });

  describe('create', () => {
    it('should create a new technology', async () => {
      const newTech = testTechnologies[0];

      const result = await service.create(newTech as TechnologyDto);

      expect(result._id).toBeDefined();
      expect(result.name).toBe(newTech.name);
    });
  });

  describe('update', () => {
    it('should update a technology', async () => {
      const created = await technologyModel.create(testTechnologies[0]);

      const result = await service.update(created._id.toString(), {
        name: 'React 18',
      } as TechnologyDto);

      expect(result?.name).toBe('React 18');
    });
  });

  describe('remove', () => {
    it('should remove a technology', async () => {
      const created = await technologyModel.create(testTechnologies[0]);

      await service.delete(created._id.toString());

      const found = await technologyModel.findById(created._id);
      expect(found).toBeNull();
    });
  });
});
