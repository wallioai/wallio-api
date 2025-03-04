import { isoBase64URL } from '@simplewebauthn/server/helpers';
import ShortUniqueId from 'short-unique-id';
import { PublicKey } from 'ox';

export const generateId = ({
  isUUID = false,
  length = 6,
  ...prop
}: Partial<ShortUniqueId.ShortUniqueIdOptions> & { isUUID?: boolean }) => {
  const uid = new ShortUniqueId({ length, ...prop });
  return isUUID ? uid.stamp(32) : uid.randomUUID();
};

export const getRpc = (rpcUrls: string[]) => {
  return rpcUrls[Math.floor(Math.random() * rpcUrls.length)];
};

export async function base64URLStringToPublicKey(
  attestationObject: string,
): Promise<`0x${string}` | undefined> {
  const uint8ArrayKey = isoBase64URL.toBuffer(attestationObject, 'base64url');
  const publicKeyBytes = new Uint8Array(uint8ArrayKey);
  let publicKey: `0x${string}`;

  const coordinateLength = 0x20;
  const cborPrefix = 0x58;

  const findStart = (key: number) => {
    const coordinate = new Uint8Array([key, cborPrefix, coordinateLength]);
    for (let i = 0; i < publicKeyBytes.length - coordinate.length; i++)
      if (coordinate.every((byte, j) => publicKeyBytes[i + j] === byte))
        return i + coordinate.length;
    throw new Error('Credentials creation failed');
  };

  const xStart = findStart(0x21);
  const yStart = findStart(0x22);

  const credPubKey = PublicKey.from(
    new Uint8Array([
      0x04,
      ...publicKeyBytes.slice(xStart, xStart + coordinateLength),
      ...publicKeyBytes.slice(yStart, yStart + coordinateLength),
    ]),
  );
  publicKey = PublicKey.toHex(credPubKey, {
    includePrefix: false,
  });

  return publicKey;
}
