import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    phone: string

    @Column()
    name: string

    @Column()
    password: string

    @Column({ name: 'created_at' })
    createdAt: Date
}
