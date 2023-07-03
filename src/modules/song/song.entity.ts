import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { File } from '../file/file.entity';
import { BaseEntity } from '../../common/models/base.entity';
import { Listing } from '../listing/listing.entity';

@Entity()
export class Song extends BaseEntity {
  @ManyToOne(() => User, (user) => user.songs)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fkey_constraint_name',
    },
  ])
  public user: User;

  @ManyToOne(() => Album, (album) => album.songs)
  @JoinColumn([
    {
      name: 'album_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'album_id_fkey',
    },
  ])
  public album: Album;

  @Column({ type: 'varchar', length: 512, nullable: false })
  public title: string;

  @Column({ type: 'integer', nullable: true })
  public length: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  public genre: string;

  @Column('text', { array: true })
  public mood: string[];

  @Column('text', { array: true })
  public tags: string[];

  @Column({ type: 'integer', nullable: true })
  public bpm: number;

  @Column({ type: 'boolean', nullable: true })
  public instrumental: boolean;

  @Column('text', { array: true, nullable: true })
  public languages: string[];

  @Column('text', { array: true, nullable: true })
  public vocal_ranges: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  public musical_key: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  price: number;

  @OneToOne(() => File)
  @JoinColumn([
    {
      name: 'music_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'music_id_fkey',
    },
  ])
  music: File;

  @Column({ type: 'timestamp', nullable: true })
  public recording_date: Date;

  @Column({ type: 'varchar', length: 512, nullable: true })
  public recording_country: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  public recording_location: string;

  @OneToOne(() => File)
  @JoinColumn([
    {
      name: 'art_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'art_id_fkey',
    },
  ])
  art: File;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public pka: string;

  @OneToMany(() => Listing, (listing) => listing.song)
  listings: Listing[];
}
