import { ApartmentsType } from '@common/enums/apartments.enum'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '@users/entities/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('apartments')
export class Apartment {
    @ApiProperty({ example: '1', description: 'apartment id', type: String })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 1,
        description: 'apartment sequence number',
        type: Number,
    })
    @Column('int')
    sequenceNumber: number

    @ApiProperty({
        example: true,
        description: 'apartment is occupied',
        type: Boolean,
    })
    @Column('boolean')
    isOccupied: boolean

    @ApiProperty({
        example: 'studio',
        description: 'apartment type',
        enum: Object.values(ApartmentsType),
    })
    @Column({ enum: ApartmentsType })
    type: ApartmentsType

    @ApiProperty({
        example: '2022-01-01',
        description: 'apartment lease start date',
        type: Date,
    })
    @Column({ type: 'date', nullable: true })
    leaseStartDate?: Date

    @ApiProperty({
        example: '2022-01-02',
        description: 'apartment lease end date',
        type: Date,
    })
    @Column({ type: 'date', nullable: true })
    leaseEndDate?: Date

    @ManyToOne(() => User, (user) => user.apartments, { nullable: true })
    currentOwner?: User
}
