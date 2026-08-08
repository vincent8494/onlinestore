/**
 * Colour system for the multi-colour design.
 *
 * Tailwind scans source statically, so every class string here is written out in
 * full — building them by interpolation (`bg-brand-${hue}/10`) would get the
 * classes dropped from the compiled CSS.
 */

export const HUES = [
  'blue',
  'violet',
  'pink',
  'amber',
  'teal',
  'lime',
  'orange',
  'cyan',
  'rose',
  'indigo',
] as const;

export type Hue = (typeof HUES)[number];

export interface HueStyle {
  /** Solid fill, for icon chips and filled badges */
  bg: string;
  /** Low-alpha tint, for card washes and soft chips */
  tint: string;
  /** Slightly stronger tint, for hover states */
  tintHover: string;
  /** Coloured text */
  text: string;
  /** Coloured text applied when an ancestor `.group` is hovered */
  groupHoverText: string;
  /** Coloured border */
  border: string;
  /** Coloured drop shadow, for the hover lift */
  glow: string;
  /** Two-stop gradient in this hue's family */
  gradient: string;
  /** Ring colour for focus/active states */
  ring: string;
}

export const HUE_STYLES: Record<Hue, HueStyle> = {
  blue: {
    bg: 'bg-brand-blue',
    tint: 'bg-brand-blue/10',
    tintHover: 'group-hover:bg-brand-blue/20',
    text: 'text-brand-blue',
    groupHoverText: 'group-hover:text-brand-blue',
    border: 'border-brand-blue/30',
    glow: 'hover:shadow-glow-blue',
    gradient: 'bg-gradient-to-br from-brand-blue to-brand-indigo',
    ring: 'ring-brand-blue',
  },
  violet: {
    bg: 'bg-brand-violet',
    tint: 'bg-brand-violet/10',
    tintHover: 'group-hover:bg-brand-violet/20',
    text: 'text-brand-violet',
    groupHoverText: 'group-hover:text-brand-violet',
    border: 'border-brand-violet/30',
    glow: 'hover:shadow-glow-violet',
    gradient: 'bg-gradient-to-br from-brand-violet to-brand-pink',
    ring: 'ring-brand-violet',
  },
  pink: {
    bg: 'bg-brand-pink',
    tint: 'bg-brand-pink/10',
    tintHover: 'group-hover:bg-brand-pink/20',
    text: 'text-brand-pink',
    groupHoverText: 'group-hover:text-brand-pink',
    border: 'border-brand-pink/30',
    glow: 'hover:shadow-glow-pink',
    gradient: 'bg-gradient-to-br from-brand-pink to-brand-rose',
    ring: 'ring-brand-pink',
  },
  amber: {
    bg: 'bg-brand-amber',
    tint: 'bg-brand-amber/10',
    tintHover: 'group-hover:bg-brand-amber/20',
    text: 'text-brand-amber',
    groupHoverText: 'group-hover:text-brand-amber',
    border: 'border-brand-amber/30',
    glow: 'hover:shadow-glow-amber',
    gradient: 'bg-gradient-to-br from-brand-amber to-brand-orange',
    ring: 'ring-brand-amber',
  },
  teal: {
    bg: 'bg-brand-teal',
    tint: 'bg-brand-teal/10',
    tintHover: 'group-hover:bg-brand-teal/20',
    text: 'text-brand-teal',
    groupHoverText: 'group-hover:text-brand-teal',
    border: 'border-brand-teal/30',
    glow: 'hover:shadow-glow-teal',
    gradient: 'bg-gradient-to-br from-brand-teal to-brand-cyan',
    ring: 'ring-brand-teal',
  },
  lime: {
    bg: 'bg-brand-lime',
    tint: 'bg-brand-lime/10',
    tintHover: 'group-hover:bg-brand-lime/20',
    text: 'text-brand-lime',
    groupHoverText: 'group-hover:text-brand-lime',
    border: 'border-brand-lime/30',
    glow: 'hover:shadow-glow-lime',
    gradient: 'bg-gradient-to-br from-brand-lime to-brand-teal',
    ring: 'ring-brand-lime',
  },
  orange: {
    bg: 'bg-brand-orange',
    tint: 'bg-brand-orange/10',
    tintHover: 'group-hover:bg-brand-orange/20',
    text: 'text-brand-orange',
    groupHoverText: 'group-hover:text-brand-orange',
    border: 'border-brand-orange/30',
    glow: 'hover:shadow-glow-orange',
    gradient: 'bg-gradient-to-br from-brand-orange to-brand-rose',
    ring: 'ring-brand-orange',
  },
  cyan: {
    bg: 'bg-brand-cyan',
    tint: 'bg-brand-cyan/10',
    tintHover: 'group-hover:bg-brand-cyan/20',
    text: 'text-brand-cyan',
    groupHoverText: 'group-hover:text-brand-cyan',
    border: 'border-brand-cyan/30',
    glow: 'hover:shadow-glow-cyan',
    gradient: 'bg-gradient-to-br from-brand-cyan to-brand-blue',
    ring: 'ring-brand-cyan',
  },
  rose: {
    bg: 'bg-brand-rose',
    tint: 'bg-brand-rose/10',
    tintHover: 'group-hover:bg-brand-rose/20',
    text: 'text-brand-rose',
    groupHoverText: 'group-hover:text-brand-rose',
    border: 'border-brand-rose/30',
    glow: 'hover:shadow-glow-rose',
    gradient: 'bg-gradient-to-br from-brand-rose to-brand-pink',
    ring: 'ring-brand-rose',
  },
  indigo: {
    bg: 'bg-brand-indigo',
    tint: 'bg-brand-indigo/10',
    tintHover: 'group-hover:bg-brand-indigo/20',
    text: 'text-brand-indigo',
    groupHoverText: 'group-hover:text-brand-indigo',
    border: 'border-brand-indigo/30',
    glow: 'hover:shadow-glow-indigo',
    gradient: 'bg-gradient-to-br from-brand-indigo to-brand-violet',
    ring: 'ring-brand-indigo',
  },
};

/** Pick a hue deterministically, so a given card keeps its colour across renders. */
export function hueAt(index: number): Hue {
  return HUES[((index % HUES.length) + HUES.length) % HUES.length];
}

export function styleAt(index: number): HueStyle {
  return HUE_STYLES[hueAt(index)];
}

/**
 * Stable hue for an arbitrary string (category name, seller name, product id).
 * Same input always lands on the same colour, so a category is the same hue on
 * every page without a hand-maintained mapping.
 */
export function hueFor(key: string): Hue {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return hueAt(Math.abs(hash));
}

export function styleFor(key: string): HueStyle {
  return HUE_STYLES[hueFor(key)];
}

/** Named category → hue, for the ones we want to pin deliberately. */
const CATEGORY_HUES: Record<string, Hue> = {
  electronics: 'blue',
  computers: 'violet',
  audio: 'pink',
  watches: 'amber',
  cameras: 'teal',
  gaming: 'lime',
  fashion: 'rose',
  beauty: 'pink',
  'beauty & personal care': 'pink',
  grocery: 'lime',
  home: 'orange',
  'home & kitchen': 'orange',
  'home & garden': 'teal',
  sports: 'cyan',
  books: 'indigo',
  toys: 'amber',
  automotive: 'indigo',
  health: 'teal',
};

/** Category hue, falling back to the hash so unknown categories still colour. */
export function categoryStyle(category: string): HueStyle {
  const pinned = CATEGORY_HUES[category?.toLowerCase?.() ?? ''];
  return pinned ? HUE_STYLES[pinned] : styleFor(category ?? '');
}
