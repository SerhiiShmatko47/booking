import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Role } from '@common/enums/role.enum'
import { Apartment } from '@apartments/entities/apartment.entity'

@Entity('users')
export class User {
    @ApiProperty({ type: String, example: '1', description: 'user id' })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        type: String,
        example: '+1234567890',
        description: 'phone number',
    })
    @Column({ unique: true })
    phone: string

    @ApiProperty({ type: String, example: 'John', description: 'user name' })
    @Column()
    name: string

    @ApiProperty({ type: String, example: 'user', description: 'user role' })
    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role

    @Exclude()
    @Column()
    password: string

    @ApiProperty({ type: Date, example: '2022-01-01T00:00:00.000Z' })
    @Column({ name: 'created_at' })
    createdAt: Date

    @ApiProperty({ type: () => [Apartment], description: 'apartments' })
    @OneToMany(() => Apartment, (apartment) => apartment.currentOwner, {
        nullable: true,
    })
    apartments?: Apartment[]
}
