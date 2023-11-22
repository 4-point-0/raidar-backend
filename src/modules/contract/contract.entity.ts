import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';
import { BaseEntity } from '../../common/models/base.entity';

@Entity()
export class Contract extends BaseEntity {
  @ManyToOne(() => User, (user) => user.contracts)
  @JoinColumn({ name: 'artist_id' })
  artist: User;

  @ManyToOne(() => User, (user) => user.contracts)
  @JoinColumn({ name: 'customer_id' })
  customer?: User;

  @ManyToOne(() => Song, (song) => song.contracts)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @Column({ type: 'varchar', length: 2048 })
  pdfUrl: string;
}
