import { Apartment } from '@apartments/entities/apartment.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@users/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentsRepository: Repository<Apartment>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    public async reserve(apartmentId: string, userId: string) {
        const apartment = await this.apartmentsRepository.findOne({
            where: { id: apartmentId },
            relations: ['currentOwner'],
        })
        if (!apartment)
            throw new BadRequestException('Apartment does not exist')
        if (apartment.isOccupied)
            throw new BadRequestException('Apartment is not occupied')
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['apartments'],
        })
        if (!user) throw new BadRequestException('User does not exist')

        apartment.currentOwner = user
        user.apartments.push(apartment)

        await this.apartmentsRepository.save(apartment)
        await this.usersRepository.save(user)
    }
    findAll() {
        return `This action returns all booking`
    }

    findOne(id: number) {
        return `This action returns a #${id} booking`
    }

    remove(id: number) {
        return `This action removes a #${id} booking`
    }
}
