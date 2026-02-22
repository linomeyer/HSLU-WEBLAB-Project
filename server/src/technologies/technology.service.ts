import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Technology } from './technology.schema';
import { Model } from 'mongoose';
import { TechnologyDto } from './dtos/technology.dto';
import { UpdateTechnologyDto } from './dtos/update-technology.dto';

@Injectable()
export class TechnologyService {
  @InjectModel(Technology.name)
  private readonly technologyModel: Model<Technology>;

  public async create(technology: TechnologyDto): Promise<Technology> {
    const newTechnology = new this.technologyModel(technology);
    return newTechnology.save();
  }

  public async findAll(): Promise<Technology[]> {
    return this.technologyModel.find().exec();
  }

  public async findOne(id: string): Promise<Technology> {
    const tech = await this.technologyModel.findById(id).exec();
    if (!tech) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }
    return tech;
  }

  public async update(
    id: string,
    technology: UpdateTechnologyDto,
  ): Promise<Technology> {
    const updatedTech = await this.technologyModel
      .findByIdAndUpdate(
        id,
        { ...technology, changedAt: new Date() },
        { returnDocument: 'after' },
      )
      .exec();

    if (!updatedTech) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }
    return updatedTech;
  }

  public async delete(id: string): Promise<Technology> {
    const deletedTech = await this.technologyModel.findByIdAndDelete(id).exec();
    if (!deletedTech) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }
    return deletedTech;
  }
}
