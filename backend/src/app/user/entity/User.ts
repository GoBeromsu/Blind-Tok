import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import UserMeta from "./UserMeta";
import UserRelation from "./UserRelation";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import File from "@file/entity/File";
import UserLogin from "@user/entity/UserLogin";
import UserAuth from "@user/entity/UserAuth";

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
  @Column({nullable: true, length: 512})
  refresh_token: string;

  @OneToOne(() => UserMeta, meta => meta.user)
  meta: UserMeta;

  @OneToMany(() => UserLogin, login => login.user)
  login: UserLogin[];

  @OneToMany(() => UserAuth, auth => auth.user)
  auth: UserAuth;

  @OneToMany(() => UserRelation, relation => relation.user)
  friends: UserRelation;

  @OneToMany(() => File, music => music.user)
  file: File;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
