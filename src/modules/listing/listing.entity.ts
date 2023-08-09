import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from '../song/song.entity';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../common/models/base.entity';

@Entity()
export class Listing extends BaseEntity {
  @ManyToOne(() => Song, (song) => song.listings)
  @JoinColumn([
    {
      name: 'song_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'song_id_fkey',
    },
  ])
  song: Song;

  @ManyToOne(() => User, (user) => user.listings_sold)
  @JoinColumn([
    {
      name: 'seller_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'seller_id_fkey',
    },
  ])
  seller: User;

  @ManyToOne(() => User, (user) => user.listings_purchased)
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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sold_price: string;
}
