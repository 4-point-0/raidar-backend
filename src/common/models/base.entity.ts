import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { CurrentUser } from './current-user';

export abstract class BaseEntity {
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

  @BeforeInsert()
  beforeInsert() {
    this.created_by_id = CurrentUser.id;
  }

  @BeforeInsert()
  @BeforeUpdate()
  beforeUpdate() {
    this.updated_by_id = CurrentUser.id;
  }
}
