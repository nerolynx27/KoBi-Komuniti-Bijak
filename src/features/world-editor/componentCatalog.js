export const componentCatalog = [
  ['house', 'House', 3, 3, true, 'map'], ['hall', 'Community hall', 1, 1, false, 'location'],
  ['park', 'Community garden', 1, 1, false, 'leaf'], ['lamp', 'Walkway lamp', 1, 1, false, 'location'],
  ['bench', 'Garden bench', 1, 1, false, 'location'], ['tree', 'Tree', 1, 1, true, 'leaf'],
  ['recycling', 'Recycling point', 1, 1, false, 'recycle'],
].map(([assetKey, label, width, height, decorative, icon]) => Object.freeze({ assetKey, label, width, height, decorative, icon }));
