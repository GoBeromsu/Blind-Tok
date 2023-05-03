import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import User from "@user/entity/User";

@Entity()
export default class Music extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  musicid: number;

  @Column()
  userid: number;

  @Column({type: COLUMN_TYPE_TEXT})
  fileName: string;
  @Column({type: COLUMN_TYPE_TEXT})
  filePath: string;

  @Column({type: COLUMN_TYPE_TEXT})
  mimeType: string;

  @Column({type: COLUMN_TYPE_BIGINT})
  duration: number;

  @Column({type: COLUMN_TYPE_BIGINT})
  fileSize: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
