export type Store<Entity> = {
  store: (data: Entity) => Promise<Entity>;
};
