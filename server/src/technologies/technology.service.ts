import { Injectable } from '@nestjs/common';
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

  async findOne(id: string): Promise<Technology | null> {
    return this.technologyModel.findById(id).exec();
  }

  async update(id: string, technology: Technology): Promise<Technology | null> {
    return this.technologyModel
      .findByIdAndUpdate(id, technology, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Technology | null> {
    return this.technologyModel.findByIdAndDelete(id).exec();
  }
}
