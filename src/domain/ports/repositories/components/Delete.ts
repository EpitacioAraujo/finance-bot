export type Delete<Entity> = {
  delete: (data: Entity) => Promise<void>;
};
