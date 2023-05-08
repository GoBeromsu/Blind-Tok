import {BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import Auth from "../../Auth/entity/Auth";
import User from "@user/entity/User";

@Entity()
export default class UserAuth extends BaseEntity {
  @PrimaryColumn()
  authid: string;

  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @ManyToOne(() => Auth, auth => auth.authid)
  @JoinColumn({name: "authid"})
  auth: Auth;

  @CreateDateColumn()
  createdate: Date;
}
