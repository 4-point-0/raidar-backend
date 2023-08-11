import { Provider, Role } from '../../common/enums/enum';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Song } from '../song/song.entity';
import { Licence } from '../licence/licence.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public last_name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: [Role.User],
    array: true,
  })
  roles: Role[];

  @Column({
    type: 'enum',
    enum: [Provider.Google],
    default: Provider.Google,
    nullable: true,
  })
  provider?: Provider;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  public provider_id?: string;

  @Column({ type: 'varchar', length: 512, unique: true, nullable: true })
  public wallet_address?: string;

  @OneToMany(() => Song, (song) => song.user)
  songs: Song[];

  @OneToMany(() => Licence, (licence) => licence.seller)
  licences_sold: Licence[];

  @OneToMany(() => Licence, (licence) => licence.buyer)
  licences_purchased: Licence[];

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  public updated_at: Date;
}
