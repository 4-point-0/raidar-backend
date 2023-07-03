import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  public updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public created_by_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public updated_by_id: string;
}
