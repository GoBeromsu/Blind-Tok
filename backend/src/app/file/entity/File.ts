import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import User from "@user/entity/User";

@Entity()
export default class File extends BaseEntity {
  @PrimaryColumn()
  fileid: string;

  @Column()
  userid: number;

  // @Column({type: COLUMN_TYPE_TEXT})
  // fileimage: any;
  // @Column({type: COLUMN_TYPE_TEXT})
  // filecomment: string;
  @Column({type: COLUMN_TYPE_TEXT})
  filename: string;

  @Column({type: COLUMN_TYPE_TEXT})
  filepath: string;

  @Column({type: COLUMN_TYPE_TEXT, nullable: true})
  image: string;
  @Column({type: COLUMN_TYPE_TEXT, nullable: true})
  comment: string;

  @Column({type: COLUMN_TYPE_TEXT})
  filetype: string;

  @Column({type: COLUMN_TYPE_TEXT})
  mimetype: string;

  @Column({type: COLUMN_TYPE_BIGINT})
  filesize: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @CreateDateColumn()
  createdate: Date;
}
