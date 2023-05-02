import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import User from "./User";
import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";

@Entity()
export default class UserRelation extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({name: "user_id"})
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({name: "friend_id"})
  friend: User;

  @Column({type: "enum", enum: ["normal", "ban"], default: "normal"})
  status: string;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
