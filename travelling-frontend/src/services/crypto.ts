import CryptoJS, { AES } from "crypto-js";

export const encrypt = async (data: any, cryptoKey: string) => {
  try {
    const encryptedData = AES.encrypt(
      JSON.stringify(data),
      cryptoKey
    ).toString();

    return encryptedData;
  } catch (error) {
    console.error("Error encrypting data", error);
  }
};

export const decrypt = async (encryptedData: string, cryptoKey: string) => {
  try {
    const decryptedBytes = AES.decrypt(encryptedData, cryptoKey);
    const decryptedData = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8)
    );

    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data", error);
  }
};
