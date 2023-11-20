import { CreateProperties, UpdateProperties } from "./types";

export function create(
  createProperties: CreateProperties,
  callback?: () => void
): number | string {
  return -1;
}

export function remove(
  menuItemId: string | number,
  callback?: () => void
): void {}

export function removeAll(callback?: () => void): void {}

export function update(
  id: string | number,
  updateProperties: UpdateProperties,
  callback?: () => void
): void {}
