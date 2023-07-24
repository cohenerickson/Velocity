import EventManager from "../types/EventManager";
import bindingUtil from "../util/bindingUtil";
import callbackWrapper from "../util/callbackWrapper";
import runtime from "./runtime";
import { openDB, DBSchema } from "idb";

type AccessLevel = "TRUSTED_CONTEXTS" | "TRUSTED_AND_UNTRUSTED_CONTEXTS";
type StorageZone = "local" | "session" | "sync" | "managed";

export interface LocalStorageDB extends DBSchema {
  ext$localStore: {
    key: string;
    value: { [key: string]: any };
  };
  ext$syncStore: {
    key: string;
    value: { [key: string]: any };
  };
  ext$managedStore: {
    key: string;
    value: { [key: string]: any };
  };
  ext$sessionStore: {
    key: string;
    value: { [key: string]: any };
  };
}

const db = await openDB<LocalStorageDB>("ext$store", 1, {
  async upgrade(db) {
    db.createObjectStore("ext$localStore", {
      keyPath: "id"
    });
    db.createObjectStore("ext$syncStore", {
      keyPath: "id"
    });
    db.createObjectStore("ext$managedStore", {
      keyPath: "id"
    });
    db.createObjectStore("ext$sessionStore", {
      keyPath: "id"
    });
  }
});

// Clear session store after each reload
db.put(`ext$sessionStore`, {
  id: runtime.id,
  value: {}
});

export const local = {
  QUOTA_BYTES: 10485760 as const,
  clear: callbackWrapper($clear("local")),
  get: callbackWrapper($get("local")),
  getBytesInUse: callbackWrapper($getBytesInUse("local")),
  remove: callbackWrapper($remove("local")),
  set: callbackWrapper($set("local")),
  setAccessLevel: callbackWrapper($setAccessLevel("local")),
  onChanged: new EventManager("storage.local.onChanged")
};

export const session = {
  QUOTA_BYTES: 10485760 as const,
  clear: callbackWrapper($clear("session")),
  get: callbackWrapper($get("session")),
  getBytesInUse: callbackWrapper($getBytesInUse("session")),
  remove: callbackWrapper($remove("session")),
  set: callbackWrapper($set("session")),
  setAccessLevel: callbackWrapper($setAccessLevel("session")),
  onChanged: new EventManager("storage.session.onChanged")
};

// Should we create a custom sync server?
// Seems like it could be an unnecesary security risk
export const sync = {
  MAX_ITEMS: 512 as const,
  MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE: 1000000 as const,
  MAX_WRITE_OPERATIONS_PER_HOUR: 1800 as const,
  MAX_WRITE_OPERATIONS_PER_MINUTE: 120 as const,
  QUOTA_BYTES: 102400 as const,
  QUOTA_BYTES_PER_ITEM: 8192 as const,
  clear: callbackWrapper($clear("sync")),
  get: callbackWrapper($get("sync")),
  getBytesInUse: callbackWrapper($getBytesInUse("sync")),
  remove: callbackWrapper($remove("sync")),
  set: callbackWrapper($set("sync")),
  setAccessLevel: callbackWrapper($setAccessLevel("sync")),
  onChanged: new EventManager("storage.sync.onChanged")
};

export const managed = {
  get: callbackWrapper($get("local")),
  getBytesInUse: callbackWrapper($getBytesInUse("local"))
};

export const onChanged = new EventManager("storage.onChanged");

function $clear(zone: StorageZone) {
  return async function (): Promise<void> {
    const bk = await local.get();

    await db.put(`ext$${zone}Store`, {
      id: runtime.id,
      value: {}
    });

    bindingUtil.emit(
      ["storage.onChanged", `storage.${zone}.onChanged`],
      Object.fromEntries(
        bk.map(([key, val]: [string, any]): [string, { oldValue: any }] => {
          return [key, { oldValue: val }];
        })
      )
    );

    return;
  };
}

function $get(zone: StorageZone) {
  return async function (
    keys?: string | string[] | { [key: string]: any }
  ): Promise<{
    [key: string]: any;
  }> {
    const data = (await db.get(`ext$${zone}Store`, runtime.id)) ?? {};
    return storageGet(data.value, keys);
  };
}

function $getBytesInUse(zone: StorageZone) {
  return async function (keys?: string | string[]): Promise<number> {
    const data = await $get(zone)(keys);

    return JSON.stringify(data).length;
  };
}

function $remove(zone: StorageZone) {
  return async function (keys: string | string[]): Promise<void> {
    const data = await $get(zone)();
    const bk = await $get(zone)();

    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    keys.forEach((key: string) => {
      if (data[key]) {
        delete data[key];
      }
    });

    await db.put(`ext$${zone}Store`, {
      id: runtime.id,
      value: data
    });

    bindingUtil.emit(
      ["storage.onChanged", `storage.${zone}.onChanged`],
      Object.fromEntries(
        Object.entries(bk)
          .filter(([key]) => !data[key])
          .map(([key, val]: [string, any]): [string, { oldValue: any }] => {
            return [key, { oldValue: val }];
          })
      )
    );

    return;
  };
}

function $set(zone: StorageZone) {
  return async function local$set(items: {
    [key: string]: any;
  }): Promise<void> {
    if (
      (await $getBytesInUse(zone)()) + JSON.stringify(items).length - 2 >
      local.QUOTA_BYTES
    ) {
      const error = new Error("The maximum amount of data has been reached.");
      runtime.lastError = error;
      throw error;
    }

    const data = await $get(zone)();
    const bk = await $get(zone)();

    Object.assign(data, items);

    await db.put(`ext$${zone}Store`, {
      id: runtime.id,
      value: data
    });

    bindingUtil.emit(
      ["storage.onChanged", `storage.${zone}.onChanged`],
      Object.fromEntries(
        Object.entries(bk)
          .filter(([key]) => data[key] !== bk[key])
          .map(([key, val]: [string, any]): [string, { oldValue: any }] => {
            return [key, { oldValue: val }];
          })
      )
    );

    return;
  };
}

function $setAccessLevel(zone: StorageZone) {
  return async function (accessLevel: AccessLevel): Promise<void> {
    return;
  };
}

function storageGet(
  data: any = {},
  keys?: string | string[] | { [key: string]: any }
): {
  [key: string]: any;
} {
  let returnVal: { [key: string]: any } = {};

  if (typeof keys === "string") {
    const value = data[keys];
    if (value) returnVal[keys] = value;
  } else if (Array.isArray(keys)) {
    keys.forEach((key: string) => {
      const value = data[key];
      if (value) returnVal[key] = value;
    });
  } else if (typeof keys === "object") {
    Object.keys(keys).forEach((key: string) => {
      const value = data[key];
      if (value) returnVal[key] = value;
      else returnVal[key] = keys[key];
    });
  } else {
    returnVal = data;
  }

  return returnVal;
}
