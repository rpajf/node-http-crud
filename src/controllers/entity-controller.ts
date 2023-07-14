
import { IEntity, IIdGenerator, IEntityPersistor } from "../types/entity";
import { writeUsersToFile, readUserFromFile } from "../utils/fileFunctions";
import http from 'http';

export class Entity<T extends IEntity> {
  // can get any additional types but required at least 
  constructor(
    public entities: T[] = [],
    // private entityPersister: IEntityPersistor,
  ) {
    this.initEntities();
  }

  // async initEntities() {
  //   this.entities = await this.entityPersister.readFromFile() as T[];
    
  // }
  async initEntities() {
		await readUserFromFile();
	}
	generateRandomId() {
		const id = Math.floor(Math.random() * 10) + 1;
		return id;
	}
  async create(entity: Omit<T, 'id'>) {
    const newEntity = { id: this.generateRandomId(), ...entity } as T;
    this.entities.push(newEntity);
    await this.persist()
  }
  list(req: http.IncomingMessage, res: http.ServerResponse) {
		res.end(JSON.stringify(this.entities));
	}
  async persist() {
    await writeUsersToFile(this.entities);
  }
  // rest of your methods...
}