import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import {BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import UserMeta from "./UserMeta";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @Column({type: COLUMN_TYPE_TEXT})
  nickname: string;
  @Column({type: COLUMN_TYPE_TEXT})
  fackekname: string;

  @Column({type: COLUMN_TYPE_TEXT})
  email: string;

  @OneToOne(() => UserMeta, meta => meta.userid)
  meta: UserMeta;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
