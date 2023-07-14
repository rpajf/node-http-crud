export interface IEntity {
	id: number;
	[key: string]: unknown;
}
export interface IIdGenerator {
	generateId: () => number;
}
export interface IEntityPersistor {
	readFromFile: () => Promise<IEntity[]>;
	writeOnFile: (entity: IEntity) => Promise<void>;
}
