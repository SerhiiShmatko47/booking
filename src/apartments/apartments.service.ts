import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateApartmentDto } from './dto/create-apartment.dto'
import { UpdateApartmentDto } from './dto/update-apartment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Apartment } from './entities/apartment.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ApartmentsService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
    ) {}

    public async create(createApartmentDto: CreateApartmentDto) {
        const apartment = await this.apartmentRepository.findOne({
            where: {
                sequenceNumber: createApartmentDto.sequenceNumber,
            },
        })
        if (apartment) throw new BadRequestException('Apartment already exists')
        const newApartment = this.apartmentRepository.create(createApartmentDto)
        return 'This action adds a new apartment'
    }

    findAll() {
        return `This action returns all apartments`
    }

    findOne(id: number) {
        return `This action returns a #${id} apartment`
    }

    update(id: number, updateApartmentDto: UpdateApartmentDto) {
        return `This action updates a #${id} apartment`
    }

    remove(id: number) {
        return `This action removes a #${id} apartment`
    }
}
