import config from "@config/ormconfig";
import {DataSource, EntityManager} from "typeorm";

const {type, host, port, username, password, database, synchronize, logging, entities, migrations} = config;
let _datasource: DataSource;

export const initDatasource = async () => {
  if (_datasource == null) {
    const datasource = new DataSource({
      type:"postgres",
      host,
      port,
      username,
      password,
      database,
      synchronize,
      logging,
      entities,
      migrations,
    });

    try {
      const startDate = new Date();
      _datasource = await datasource.initialize();
      const endDate = new Date();
      console.log(`database connected! elapsed time ${endDate.getTime() - startDate.getTime()}ms`);
    } catch (err: any) {
      throw new Error(err);
    }
  }
  return _datasource;
};
