import Preferences from "~/types/Preferences";

export default function preferences(): Preferences {
  return JSON.parse(localStorage.getItem("preferences") || "{}");
}
