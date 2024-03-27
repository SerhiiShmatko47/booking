import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateApartmentDto } from './dto/create-apartment.dto'
import { UpdateApartmentDto } from './dto/update-apartment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Apartment } from './entities/apartment.entity'
import { Repository } from 'typeorm'
import { Message } from '@common/types/message.types'

@Injectable()
export class ApartmentsService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentsRepository: Repository<Apartment>,
    ) {}

    /**
     * Create a new apartment based on the provided data.
     * @param {CreateApartmentDto} createApartmentDto - The data to create the apartment
     * @return {Promise<Message>} A message indicating the success of the operation
     */
    public async create(
        createApartmentDto: CreateApartmentDto,
    ): Promise<Message> {
        const apartment = await this.apartmentsRepository.findOne({
            where: {
                sequenceNumber: createApartmentDto.sequenceNumber,
            },
        })
        if (apartment) throw new BadRequestException('Apartment already exists')
        const newApartment =
            this.apartmentsRepository.create(createApartmentDto)
        await this.apartmentsRepository.save(newApartment)
        return { message: 'Apartment created successfully' }
    }

    /**
     * A description of the entire function.
     * @param {number} take - description of parameter
     * @param {number} skip - description of parameter
     * @return {Promise<Apartment[]>} description of return value
     */
    public async findAll(
        take: number = 10,
        skip: number = 0,
    ): Promise<Apartment[]> {
        return this.apartmentsRepository.find({
            take,
            skip,
        })
    }

    /**
     * Find one apartment by ID.
     * @param {string} id - The ID of the apartment to find
     * @return {Promise<Apartment>} The found apartment
     */
    public async findOne(id: string): Promise<Apartment> {
        return this.apartmentsRepository.findOne({ where: { id } })
    }

    /**
     * Updates an apartment in the database.
     * @param {string} id - The ID of the apartment to update.
     * @param {UpdateApartmentDto} updateApartmentDto - The data to update the apartment with.
     * @return {Promise<Message>} A message indicating the success of the update operation.
     */
    public async update(
        id: string,
        updateApartmentDto: UpdateApartmentDto,
    ): Promise<Message> {
        const isApartmentExist = await this.apartmentsRepository.findOne({
            where: { id },
        })
        if (!isApartmentExist)
            throw new BadRequestException('Apartment does not exist')
        await this.apartmentsRepository.update(id, updateApartmentDto)
        return { message: 'Apartment updated successfully' }
    }

    /**
     * Removes an apartment with the given ID.
     * @param {string} id - The ID of the apartment to remove.
     * @return {Promise<Message>} - A promise that resolves to a message indicating the success of the removal.
     */
    public async remove(id: string): Promise<Message> {
        const isApartmentExist = await this.apartmentsRepository.findOne({
            where: { id },
        })
        if (!isApartmentExist)
            throw new BadRequestException('Apartment does not exist')
        await this.apartmentsRepository.delete(id)
        return { message: 'Apartment removed successfully' }
    }
}
