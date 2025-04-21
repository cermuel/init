import { openDB } from "idb";

const DB_NAME = "InitDesktopDB";
const STORE_NAME = "wallpaper";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

async function saveWallpaper(blob: Blob) {
  const db = await getDB();
  await db.put(STORE_NAME, blob, "current");
}

async function loadWallpaper(): Promise<string | null> {
  const db = await getDB();
  const blob = await db.get(STORE_NAME, "current");
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

async function clearWallpaper() {
  const db = await getDB();
  await db.delete(STORE_NAME, "current");
}

export const wallpaperDB = {
  clearWallpaper,
  loadWallpaper,
  saveWallpaper,
  getDB,
};
