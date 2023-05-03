import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";

@Entity()
export default class UserMeta extends BaseEntity {
  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @Column({type: COLUMN_TYPE_TEXT})
  profilemesage: string;

  @Column({type: COLUMN_TYPE_TEXT})
  profilepictureurl: string;

  @OneToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;
}
