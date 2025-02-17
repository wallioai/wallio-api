import ShortUniqueId from 'short-unique-id';

export const generateId = ({
  isUUID = false,
  length = 6,
  ...prop
}: Partial<ShortUniqueId.ShortUniqueIdOptions> & { isUUID?: boolean }) => {
  const uid = new ShortUniqueId({ length, ...prop });
  return isUUID ? uid.stamp(32) : uid.randomUUID();
};
