import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/models/base.entity';

@Entity()
export class File extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public mime_type: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  public url: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  public key: string;
}
