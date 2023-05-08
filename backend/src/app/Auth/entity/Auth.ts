import {COLUMN_TYPE_ENUM, CommonYN} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Auth extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  authid: string;

  @Column({length: 40})
  authname: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.Y})
  useyn: string;

  @CreateDateColumn()
  createdate: Date;
}
