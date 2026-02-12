export type Get<Entity> = {
  get: (id: string) => Promise<Entity | null>;
};
