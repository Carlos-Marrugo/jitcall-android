
export interface IStatement<T, K extends keyof T>{

	insert(entity: T): Promise<T[K]>;

	update(key: T[K], entity: Partial<T>): Promise<boolean>;

	delete(key: T[K]): Promise<boolean>;

}