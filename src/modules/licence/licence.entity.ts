import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../common/models/base.entity';

@Entity()
export class Licence extends BaseEntity {
  @ManyToOne(() => Song, (song) => song.licences)
  @JoinColumn([
    {
      name: 'song_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'song_id_fkey',
    },
  ])
  song: Song;

  @ManyToOne(() => User, (user) => user.licences_sold)
  @JoinColumn([
    {
      name: 'seller_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'seller_id_fkey',
    },
  ])
  seller: User;

  @ManyToOne(() => User, (user) => user.licences_purchased)
  @JoinColumn([
    {
      name: 'buyer_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'buyer_id_fkey',
    },
  ])
  buyer: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public tx_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sold_price: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public invoice_id: string;
}
