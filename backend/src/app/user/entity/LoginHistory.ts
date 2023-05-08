import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
@Entity()
export default class LoginHistory extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  historyid: number;

  @Column({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @Column({length: 100})
  ssoid: string;

  @Column({length: 512})
  token: string;

  @CreateDateColumn()
  createdate: Date;

  //명시하면 넣기
  @Column({nullable: true})
  logoutdate: Date;
}
