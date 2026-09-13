import Phaser from "phaser";
import "./style.css";
import {
  SAVE_KEY,
  advanceCare,
  applyAction,
  decodeCare,
  setResting,
} from "./care";
import { Room, type RoomAction } from "./Room";

const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
let storageAvailable = true;
let raw: string | null = null;
try {
  raw = localStorage.getItem(SAVE_KEY);
} catch {
  storageAvailable = false;
}
let care = decodeCare(raw);
let busy = false;
let ready = false;
const buttons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-action]"),
];

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(care));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  $("#save-status").textContent = storageAvailable
    ? "Saved on this device"
    : "Session only · save unavailable";
}
function render() {
  for (const key of ["fullness", "happiness", "energy"] as const) {
    const value = Math.round(care[key]);
    $(`#${key}-value`).textContent = `${value}%`;
    $(`#${key}`).setAttribute("aria-valuenow", String(value));
    $(`#${key}>span`).style.width = `${value}%`;
  }
  $("#bond").textContent =
    `♡ ${care.bond} little ${care.bond === 1 ? "moment" : "moments"} together`;
  $("#rest-label").textContent = care.resting ? "Wake" : "Rest";
  $("#rest-description").textContent = care.resting
    ? "Hello again"
    : "A quiet moment";
  document.body.classList.toggle("is-resting", care.resting);
  buttons.forEach((button) => {
    button.disabled =
      !ready || busy || (care.resting && button.dataset.action !== "rest");
    button.dataset.active = String(
      care.resting && button.dataset.action === "rest",
    );
  });
  $<HTMLButtonElement>("#call").disabled = !ready || busy || care.resting;
}
function act(action: RoomAction) {
  if (!ready || busy) return;
  if (care.resting && action !== "rest") return;
  if (action === "play" && care.energy < 8) {
    $("#message").textContent =
      "She’s a little sleepy. A rest first, then more adventures.";
    return;
  }
  room.perform(action === "rest" && care.resting ? "wake" : action);
}
const room = new Room(
  {
    ready: () => {
      ready = true;
      $("#loading").hidden = true;
      render();
    },
    message: (message) => {
      $("#message").textContent = message;
    },
    busy: (value) => {
      busy = value;
      render();
    },
    complete: (action) => {
      care = applyAction(care, action);
      save();
      render();
    },
    rest: (resting) => {
      care = setResting(care, resting);
      save();
      render();
    },
    pet: () => act("pet"),
    error: () => {
      $("#loading").textContent =
        "Ronnie’s room couldn’t load. Please refresh to try again.";
    },
  },
  care.resting,
);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 390,
  height: 450,
  backgroundColor: "#e3dfcd",
  scene: room,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, roundPixels: false },
  input: { activePointers: 2 },
  audio: { noAudio: true },
  banner: false,
});
buttons.forEach((button) =>
  button.addEventListener("click", () =>
    act(button.dataset.action as RoomAction),
  ),
);
$("#call").addEventListener("click", () => act("call"));
const dialog = $<HTMLDialogElement>("#help-dialog");
$("#help").addEventListener("click", () => dialog.showModal());
$("#back-to-ronnie").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});

function refreshCare() {
  care = advanceCare(care, Date.now());
  save();
  render();
}
// Hidden tabs must not repeatedly apply decay and defeat the eight-hour absence cap.
setInterval(() => {
  if (!document.hidden) refreshCare();
}, 10_000);
document.addEventListener("visibilitychange", refreshCare);
window.addEventListener("pagehide", refreshCare);
render();
save();
