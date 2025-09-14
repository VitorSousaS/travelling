import localforage from "localforage";
import { CategoryType, FilterContextType, UserType } from "../interfaces";
import { decrypt, encrypt } from "./crypto";

const ENCRYPTED_KEY_FORAGE = "e12a0214-8709-4378-bfaf-c96690f128a4";

export const setForageUser = async (user: UserType) => {
  try {
    const encryptedDataString = await encrypt(user, ENCRYPTED_KEY_FORAGE);
    localforage.setItem("user", encryptedDataString);
  } catch (error) {
    console.error("***error on set user in forage", error);
  }
};

export const getForageUser = async () => {
  try {
    const encryptedDataString = await localforage.getItem("user");
    if (!!encryptedDataString) {
      return await decrypt(
        encryptedDataString.toString(),
        ENCRYPTED_KEY_FORAGE
      );
    }
  } catch (error) {
    console.error("***error on get data user from forage", error);
  }
};

export const setForageFilters = async (
  key: string,
  filters: FilterContextType["selectedFilters"]
) => {
  try {
    const encryptedDataString = await encrypt(filters, ENCRYPTED_KEY_FORAGE);
    localforage.setItem(key, encryptedDataString);
  } catch (error) {
    console.error(`***error on set filters from forage for ${key}`);
  }
};

export const getForageFilters = async (key: string) => {
  try {
    const encryptedDataString = await localforage.getItem(key);
    if (!!encryptedDataString) {
      return await decrypt(
        encryptedDataString.toString(),
        ENCRYPTED_KEY_FORAGE
      );
    }
    return null;
  } catch (error) {
    console.error(`***error on get filters from forage for ${key}`);
  }
};

export const setForageCategories = async (
  categories: Partial<CategoryType[]>
) => {
  try {
    const encryptedDataString = await encrypt(categories, ENCRYPTED_KEY_FORAGE);
    localforage.setItem("categories", encryptedDataString);
  } catch (error) {
    console.error(`***error on set filters from forage for categories`);
  }
};

export const getForageCategories = async () => {
  try {
    const encryptedDataString = await localforage.getItem("categories");
    if (!!encryptedDataString) {
      return await decrypt(
        encryptedDataString.toString(),
        ENCRYPTED_KEY_FORAGE
      );
    }
    return null;
  } catch (error) {
    console.error(`***error on get filters from forage for categories`);
  }
};

export const clearAll = async () => {
  try {
    localforage.clear();
  } catch (error) {
    console.error("***error on clear all from forage");
  }
};
