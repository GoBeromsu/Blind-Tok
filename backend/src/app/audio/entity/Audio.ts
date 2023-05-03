import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import User from "@user/entity/User";

@Entity()
export default class Audio extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  audioid: number;

  @Column()
  userid: number;

  @Column({type: COLUMN_TYPE_TEXT})
  fileName: string;
  @Column({type: COLUMN_TYPE_TEXT})
  filePath: string;

  @Column({type: COLUMN_TYPE_TEXT})
  mime_type: string;

  @Column({type: COLUMN_TYPE_BIGINT})
  duration: number;

  @Column({type: COLUMN_TYPE_BIGINT})
  file_size: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
