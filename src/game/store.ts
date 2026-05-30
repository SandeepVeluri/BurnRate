import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, AppScreen, Player, PlayerColor, GameState, Territory, Customer } from './types';
import { TERRITORY_DEFS } from '../data/territories';

function makeCustomers(): Customer[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `c${i}`,
    stage: 'unaware',
    ownerId: null,
    loyaltyPips: 0,
  }));
}

function makeTerritory(def: { id: string; name: string; vertical: string }): Territory {
  return {
    id: def.id,
    name: def.name,
    vertical: def.vertical,
    adoptionFilled: 0,
    customers: makeCustomers(),
    flags: [],
    subsidyZone: {},
    saturated: false,
  };
}

function startGame(playerSetups: Array<{ name: string; color: PlayerColor }>): GameState {
  const players: Player[] = playerSetups.map((p, i) => ({
    id: `player-${i}`,
    name: p.name,
    color: p.color,
    cash: 15,
    flagsRemaining: 6,
    dilutionTokens: 0,
    firstMoverTokens: [],
    pricingDials: {},
    hiddenObjective: `obj-${(i % 8) + 1}`,
  }));

  const territories: Territory[] = TERRITORY_DEFS.map(makeTerritory);

  const eventDeck = Array.from({ length: 20 }, (_, i) => `event-${i + 1}`);

  return {
    round: 1,
    phase: 'event',
    currentPlayerIndex: 0,
    actionsRemaining: 2,
    players,
    territories,
    eventDeck,
    currentEvent: null,
    activeEventEffects: [],
    log: [],
  };
}

interface Store extends AppState {
  setScreen: (screen: AppScreen) => void;
  initGame: (players: Array<{ name: string; color: PlayerColor }>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      screen: 'setup',
      game: null,

      setScreen: (screen) => set({ screen }),

      initGame: (players) => {
        const game = startGame(players);
        set({ game, screen: 'game' });
      },
    }),
    {
      name: 'burn-rate-state',
    }
  )
);
