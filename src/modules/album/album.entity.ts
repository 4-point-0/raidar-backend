import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Song } from '../song/song.entity';
import { File } from '../file/file.entity';
import { BaseEntity } from '../../common/models/base.entity';

@Entity()
export class Album extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  public title: string;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];

  @OneToOne(() => File)
  @JoinColumn([
    {
      name: 'cover_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'cover_id_fkey',
    },
  ])
  cover: File;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public pka: string;
}
