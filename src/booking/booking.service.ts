import { Apartment } from '@apartments/entities/apartment.entity'
import { Message } from '@common/types/message.types'
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

    /**
     * Reserves an apartment for a user during a specific time period.
     * @param {string} apartmentId - the ID of the apartment to be reserved
     * @param {string} userId - the ID of the user making the reservation
     * @param {Date} start - the start date of the lease
     * @param {Date} end - the end date of the lease
     * @return {Promise<Message>} an object with a message indicating the success of the reservation
     */
    public async reserve(
        apartmentId: string,
        userId: string,
        start: Date,
        end: Date,
    ): Promise<Message> {
        const [apartment, user] = await this.isUserAndApartmentExists(
            apartmentId,
            userId,
        )
        if (apartment.isOccupied)
            throw new BadRequestException('Apartment is not occupied')

        if (start >= end) throw new BadRequestException('Invalid date range')

        apartment.currentOwner = user
        apartment.leaseStartDate = start
        apartment.leaseEndDate = end
        apartment.isOccupied = true
        user.apartments.push(apartment)

        await this.saveApartmentAndUserWithTransaction(apartment, user)

        return { message: 'Apartment reserved successfully' }
    }

    /**
     * Unreserves an apartment for a user.
     * @param {string} apartmentId - The ID of the apartment to unreserve.
     * @param {string} userId - The ID of the user who reserved the apartment.
     * @return {Promise<Message>} - A promise that resolves to an object with a success message.
     * @throws {BadRequestException} - If the apartment is not reserved.
     */
    public async unreserve(
        apartmentId: string,
        userId: string,
    ): Promise<Message> {
        const [apartment, user] = await this.isUserAndApartmentExists(
            apartmentId,
            userId,
        )

        if (!apartment.isOccupied)
            throw new BadRequestException('Apartment is not reserved')

        if (apartment.currentOwner.id !== user.id)
            throw new BadRequestException(
                'You are not the owner of the apartment',
            )
        apartment.currentOwner = null
        apartment.leaseStartDate = null
        apartment.leaseEndDate = null
        apartment.isOccupied = false
        user.apartments = user.apartments.filter(
            (apartment) => apartment.id !== apartmentId,
        )

        await this.saveApartmentAndUserWithTransaction(apartment, user)

        return { message: 'Apartment unreserved successfully' }
    }

    /**
     * Find reservations for a specific user.
     * @param {string} userId - The ID of the user
     * @return {Promise<Apartment[]>} The list of apartments reserved by the user
     */
    public async findMyReservations(userId: string): Promise<Apartment[]> {
        return this.apartmentsRepository.find({
            where: { currentOwner: { id: userId } },
        })
    }

    /**
     * Check if the user and apartment exist.
     * @param {string} apartmentId - The ID of the apartment
     * @param {string} userId - The ID of the user
     * @return {Promise<[Apartment, User]>} A tuple containing the Apartment and User if they exist
     */
    private async isUserAndApartmentExists(
        apartmentId: string,
        userId: string,
    ): Promise<[Apartment, User]> {
        const apartment = await this.apartmentsRepository.findOne({
            where: { id: apartmentId },
            relations: ['currentOwner'],
        })
        if (!apartment)
            throw new BadRequestException('Apartment does not exist')

        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['apartments'],
        })
        if (!user) throw new BadRequestException('User does not exist')
        return [apartment, user]
    }

    /**
     * Saves an apartment and a user within a transaction.
     * @param {Apartment} apartment - The apartment object to be saved.
     * @param {User} user - The user object to be saved.
     * @return {Promise<void>} A promise that resolves when the save operation is complete.
     */
    private async saveApartmentAndUserWithTransaction(
        apartment: Apartment,
        user: User,
    ): Promise<void> {
        return this.apartmentsRepository.manager.transaction(
            async (entityManager) => {
                await entityManager.save(Apartment, apartment)
                await entityManager.save(User, user)
            },
        )
    }
}
