import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, AppScreen, Player, PlayerColor, GameState, Territory, Customer } from './types';
import { TERRITORY_DEFS } from '../data/territories';
import { runMarket } from './phases/market';
import { applySubsidize, applyWait } from './phases/actions';

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
    subsidizedThisRound: {},
    pricedThisRound: {},
  };
}

/** After decrementing actionsRemaining and possibly cycling currentPlayerIndex,
 *  return the next state. Handles advancing to market when all players done. */
function advanceAction(state: GameState): GameState {
  const actionsRemaining = state.actionsRemaining - 1;

  if (actionsRemaining > 0) {
    // Same player, still has actions
    return { ...state, actionsRemaining };
  }

  // Move to next player
  const nextPlayerIndex = state.currentPlayerIndex + 1;
  if (nextPlayerIndex < state.players.length) {
    return {
      ...state,
      actionsRemaining: 2,
      currentPlayerIndex: nextPlayerIndex,
    };
  }

  // All players done — advance to market
  return {
    ...state,
    actionsRemaining: 2,
    currentPlayerIndex: 0,
    phase: 'market',
    log: [
      ...state.log,
      { round: state.round, phase: 'actions', message: 'All players done — advancing to Market phase' },
    ],
  };
}

interface Store extends AppState {
  setScreen: (screen: AppScreen) => void;
  initGame: (players: Array<{ name: string; color: PlayerColor }>) => void;
  drawEvent: () => void;
  subsidize: (territoryId: string) => void;
  wait: () => void;
  runMarketPhase: () => void;
  runRevenuePhase: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      screen: 'setup',
      game: null,

      setScreen: (screen) => set({ screen }),

      initGame: (players) => {
        const game = startGame(players);
        set({ game, screen: 'game' });
      },

      drawEvent: () => {
        const { game } = get();
        if (!game || game.phase !== 'event') return;
        set({
          game: {
            ...game,
            phase: 'actions',
            currentPlayerIndex: 0,
            actionsRemaining: 2,
            log: [
              ...game.log,
              { round: game.round, phase: 'event', message: 'No event this round — advancing to Actions' },
            ],
          },
        });
      },

      subsidize: (territoryId: string) => {
        const { game } = get();
        if (!game || game.phase !== 'actions') return;
        const playerId = game.players[game.currentPlayerIndex].id;
        try {
          const updated = applySubsidize(game, playerId, territoryId);
          const next = advanceAction(updated);
          set({ game: next });
        } catch (e) {
          console.error('Subsidize failed:', e);
        }
      },

      wait: () => {
        const { game } = get();
        if (!game || game.phase !== 'actions') return;
        const playerId = game.players[game.currentPlayerIndex].id;
        const updated = applyWait(game, playerId);
        const next = advanceAction(updated);
        set({ game: next });
      },

      runMarketPhase: () => {
        const { game } = get();
        if (!game || game.phase !== 'market') return;
        const updated = runMarket(game);
        set({
          game: {
            ...updated,
            phase: 'revenue',
            log: [
              ...updated.log,
              { round: game.round, phase: 'market', message: 'Market phase resolved — advancing to Revenue' },
            ],
          },
        });
      },

      runRevenuePhase: () => {
        const { game } = get();
        if (!game || game.phase !== 'revenue') return;
        const nextRound = game.round + 1;
        if (nextRound > 10) {
          set({
            game: {
              ...game,
              phase: 'endgame',
              log: [
                ...game.log,
                { round: game.round, phase: 'revenue', message: 'Round 10 complete — game over!' },
              ],
            },
          });
          return;
        }
        set({
          game: {
            ...game,
            round: nextRound,
            phase: 'event',
            currentPlayerIndex: 0,
            actionsRemaining: 2,
            subsidizedThisRound: {},
            pricedThisRound: {},
            log: [
              ...game.log,
              { round: game.round, phase: 'revenue', message: `Round ${game.round} complete — starting round ${nextRound}` },
            ],
          },
        });
      },
    }),
    {
      name: 'burn-rate-state',
    }
  )
);
