import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

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

    @Exclude()
    @Column()
    password: string

    @ApiProperty({ type: Date, example: '2022-01-01T00:00:00.000Z' })
    @Column({ name: 'created_at' })
    createdAt: Date
}
