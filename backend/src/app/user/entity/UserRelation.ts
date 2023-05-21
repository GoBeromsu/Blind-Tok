import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import User from "./User";
import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";

@Entity()
export default class UserRelation extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  relationid: number;

  @Column()
  userid: number;
  @Column()
  friendid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @ManyToOne(() => User, user => user.friends)
  @JoinColumn({name: "friendid"})
  friend: User[];

  //TODO: enum 값 상수로 빼야 한다
  @Column({type: "enum", enum: ["normal", "ban", "wait"], default: "normal"})
  status: string;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
