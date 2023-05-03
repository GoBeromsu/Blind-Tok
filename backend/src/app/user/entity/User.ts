import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import UserMeta from "./UserMeta";
import UserRelation from "./UserRelation";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import Audio from "@audio/index";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;
  // 실제 사용자의 이름
  @Column({type: COLUMN_TYPE_TEXT})
  name: string;
  // 친구가 아닌 사람들이 보면 보일 별명
  @Column({type: COLUMN_TYPE_TEXT})
  nickname: string;

  @Column({type: COLUMN_TYPE_TEXT})
  email: string;

  @OneToOne(() => UserMeta, meta => meta.user)
  meta: UserMeta;

  @OneToMany(() => UserRelation, relation => relation.user)
  friends: UserRelation;

  @OneToMany(() => Audio, audio => audio.user)
  audio: Audio;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
