export type DataAttributes = {
  [Key in `data-${string}`]?: boolean | number | string | undefined;
};
