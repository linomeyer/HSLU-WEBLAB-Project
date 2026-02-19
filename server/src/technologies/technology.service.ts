import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Technology } from './technology.schema';
import { Model } from 'mongoose';

@Injectable()
export class TechnologyService {
  @InjectModel(Technology.name)
  private readonly technologyModel: Model<Technology>;

  async create(technology: Technology): Promise<Technology> {
    const newTechnology = new this.technologyModel(technology);
    return newTechnology.save();
  }

  async findAll(): Promise<Technology[]> {
    return this.technologyModel.find().exec();
  }

  async findOne(id: string): Promise<Technology> {
    const tech = await this.technologyModel.findById(id).exec();
    if (!tech) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }
    return tech;
  }

  async update(id: string, technology: Technology): Promise<Technology> {
    technology.changedAt = new Date();
    const updatedTech = await this.technologyModel
      .findByIdAndUpdate(id, technology, { new: true })
      .exec();

    if (!updatedTech) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }
    return updatedTech;
  }

  async delete(id: string): Promise<Technology> {
    const deletedTech = await this.technologyModel.findByIdAndDelete(id).exec();
    if (!deletedTech) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }
    return deletedTech;
  }
}
