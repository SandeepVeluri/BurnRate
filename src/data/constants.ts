export const PLAYER_COLORS = ['p1', 'p2', 'p3', 'p4'] as const;

export const PLAYER_COLOR_LABELS: Record<string, string> = {
  p1: 'Magenta',
  p2: 'Teal',
  p3: 'Purple',
  p4: 'Lime',
};

export const STAGE_LABELS = {
  unaware: 'Unaware',
  aware: 'Aware',
  adopter: 'Adopter',
  loyal: 'Loyal',
} as const;

export const TIER_LABELS = {
  free: 'Free',
  discount: 'Discount',
  market: 'Market',
  premium: 'Premium',
} as const;

export const EVENT_CATEGORY_LABELS = {
  macro: 'Macro Economy',
  market: 'Market Shift',
  behavior: 'Behavior',
  swan: 'Black Swan',
} as const;
