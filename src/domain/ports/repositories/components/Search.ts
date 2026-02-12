export type Search<Entity, Filter> = {
  search: (filter: Filter) => Promise<Entity[]>;
};
