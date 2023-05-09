import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "@common/CommonConstants";
import {LOGIN_TYPE} from "@user/UserConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import User from "./User";
@Entity()
export default class UserLogin extends BaseEntity {
  @Column({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @PrimaryColumn({length: 100})
  ssoid: string;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @Column({nullable: true})
  email: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: LOGIN_TYPE})
  type: string;

  @CreateDateColumn()
  createdate: Date;
}
