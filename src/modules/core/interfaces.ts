export interface ClassType<T> {
  new (args?: Partial<T>): T;
}
