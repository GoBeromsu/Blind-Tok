import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";

@Entity()
export default class UserMeta extends BaseEntity {
  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @Column({nullable: true, type: COLUMN_TYPE_TEXT})
  profileMessage: string;

  @Column({default: "https://i.imgur.com/4tZUf8h.png", type: COLUMN_TYPE_TEXT})
  profilePictureUrl: string;

  @OneToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;
}
