export type Stage = 'unaware' | 'aware' | 'adopter' | 'loyal';
export type Tier = 'free' | 'discount' | 'market' | 'premium';
export type ActionType = 'subsidize' | 'price' | 'wait' | 'raise';
export type Phase = 'event' | 'actions' | 'market' | 'revenue' | 'endgame';
export type PlayerColor = 'p1' | 'p2' | 'p3' | 'p4';

export interface Customer {
  id: string;
  stage: Stage;
  ownerId: string | null;
  loyaltyPips: number;
}

export interface Territory {
  id: string;
  name: string;
  vertical: string;
  adoptionFilled: number;
  customers: Customer[];
  flags: string[];
  subsidyZone: Record<string, number>;
  saturated: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  cash: number;
  flagsRemaining: number;
  dilutionTokens: number;
  firstMoverTokens: string[];
  pricingDials: Record<string, Tier>;
  hiddenObjective: string;
}

export interface ActiveEffect {
  cardId: string;
  roundsRemaining: number;
  data: Record<string, unknown>;
}

export interface GameLogEntry {
  round: number;
  phase: Phase;
  message: string;
}

export interface GameState {
  round: number;
  phase: Phase;
  currentPlayerIndex: number;
  actionsRemaining: number;
  players: Player[];
  territories: Territory[];
  eventDeck: string[];
  currentEvent: string | null;
  activeEventEffects: ActiveEffect[];
  log: GameLogEntry[];
}

export type AppScreen = 'setup' | 'game' | 'endgame';

export interface AppState {
  screen: AppScreen;
  game: GameState | null;
}
