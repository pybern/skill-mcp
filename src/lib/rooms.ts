export type Room = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  hasVc: boolean;
  equipment: string[];
  pricePerHour: number;
};

export const ROOMS: Room[] = [
  {
    id: "ash",
    name: "Ash",
    floor: 5,
    capacity: 4,
    hasVc: false,
    equipment: ["whiteboard"],
    pricePerHour: 18,
  },
  {
    id: "birch",
    name: "Birch",
    floor: 3,
    capacity: 12,
    hasVc: true,
    equipment: ["whiteboard", "vc", "tv"],
    pricePerHour: 65,
  },
  {
    id: "cedar",
    name: "Cedar",
    floor: 3,
    capacity: 8,
    hasVc: true,
    equipment: ["whiteboard", "vc"],
    pricePerHour: 30,
  },
  {
    id: "dune",
    name: "Dune",
    floor: 7,
    capacity: 6,
    hasVc: false,
    equipment: ["tv"],
    pricePerHour: 22,
  },
];

export type Rule = {
  id: string;
  label: string;
  kind: "must" | "default" | "prefer" | "guard";
};

export const RULES: Rule[] = [
  {
    id: "vc",
    label:
      "If any attendee is **remote**, the room **must** have video conferencing.",
    kind: "must",
  },
  {
    id: "floor",
    label: "Default to **floor 3** (closest to the team).",
    kind: "default",
  },
  {
    id: "size",
    label: "Prefer the **smallest** room that fits — leave big rooms for big meetings.",
    kind: "prefer",
  },
  {
    id: "price",
    label: "**Confirm** before booking anything over $50/hr.",
    kind: "guard",
  },
];

export const WINNER_ID = "cedar";

export const REQUEST = {
  text: "Book a room tomorrow 2pm for 6, two folks remote.",
  date: "tomorrow",
  time: "14:00",
  size: 6,
  remoteAttendees: 2,
};
