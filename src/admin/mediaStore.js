const MEDIA_DB_NAME = "morphix-admin-media";
const MEDIA_STORE_NAME = "assets";
const MEDIA_DB_VERSION = 1;

function openMediaDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(MEDIA_DB_NAME, MEDIA_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        database.createObjectStore(MEDIA_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function createAssetId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `asset_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function runStoreRequest(mode, executor) {
  return openMediaDatabase().then((database) => {
    if (!database) return null;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(MEDIA_STORE_NAME, mode);
      const store = transaction.objectStore(MEDIA_STORE_NAME);

      executor(store, resolve, reject);

      transaction.onerror = () => reject(transaction.error);
    });
  });
}

export function assetKindFromType(type = "") {
  return type.startsWith("video/") ? "video" : "image";
}

export function saveMediaAsset(file) {
  const record = {
    id: createAssetId(),
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
    blob: file,
  };

  return runStoreRequest("readwrite", (store, resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  }).then((result) => {
    if (!result) {
      throw new Error("Media storage is unavailable in this browser.");
    }

    return result;
  });
}

export function readMediaAsset(assetId) {
  return runStoreRequest("readonly", (store, resolve, reject) => {
    const request = store.get(assetId);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export function readAllMediaAssets() {
  return runStoreRequest("readonly", (store, resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const results = Array.isArray(request.result) ? request.result : [];
      results.sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  }).then((results) => results ?? []);
}

export function deleteMediaAsset(assetId) {
  return runStoreRequest("readwrite", (store, resolve, reject) => {
    const request = store.delete(assetId);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
