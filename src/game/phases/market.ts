import type { GameState, Territory, GameLogEntry } from '../types';

/** Returns a new GameState after running the Market phase. Pure function. */
export function runMarket(state: GameState): GameState {
  const newLog: GameLogEntry[] = [];
  const updatedTerritories = state.territories.map((t) =>
    resolveTerritoryWithLog(t, state, newLog)
  );

  return {
    ...state,
    territories: updatedTerritories,
    log: [...state.log, ...newLog],
  };
}

function resolveTerritoryWithLog(
  territory: Territory,
  state: GameState,
  log: GameLogEntry[]
): Territory {
  const total = Object.values(territory.subsidyZone).reduce((s, v) => s + v, 0);
  let customers = territory.customers.map((c) => ({ ...c }));
  let adoptionFilled = territory.adoptionFilled;
  let saturated = territory.saturated;

  if (total >= 3) {
    // Find who put the most cash in subsidyZone
    let topPlayerId: string | null = null;
    let topAmount = -1;
    for (const [pid, amount] of Object.entries(territory.subsidyZone)) {
      if (
        amount > topAmount ||
        (amount === topAmount &&
          topPlayerId !== null &&
          state.players.findIndex((p) => p.id === pid) <
            state.players.findIndex((p) => p.id === topPlayerId))
      ) {
        topAmount = amount;
        topPlayerId = pid;
      }
    }

    // Upgrade each customer one stage
    customers = customers.map((c) => {
      if (c.stage === 'unaware') return { ...c, stage: 'aware' as const };
      if (c.stage === 'aware') {
        // First time becoming adopter this round — assign owner
        const newOwner = topPlayerId;
        adoptionFilled = Math.min(10, adoptionFilled + 1);
        return { ...c, stage: 'adopter' as const, ownerId: newOwner };
      }
      if (c.stage === 'adopter') return { ...c, stage: 'loyal' as const };
      return c; // loyal stays loyal
    });

    if (adoptionFilled >= 10) saturated = true;

    log.push({
      round: state.round,
      phase: 'market',
      message: `${territory.name}: subsidized $${total} — customers upgraded`,
    });
  } else {
    // Downgrade aware → unaware
    customers = customers.map((c) => {
      if (c.stage === 'aware') return { ...c, stage: 'unaware' as const };
      return c;
    });
    if (total > 0) {
      log.push({
        round: state.round,
        phase: 'market',
        message: `${territory.name}: insufficient subsidy ($${total}) — aware customers downgraded`,
      });
    }
  }

  // Clear subsidyZone
  const subsidyZone: Record<string, number> = {};

  // Customer stealing (§4.5): for each unowned aware/adopter, assign to flagged player with lowest pricing dial
  // Since pricing dial not active, we use fallback: player with most existing customers in territory
  customers = customers.map((c) => {
    if (c.ownerId !== null) return c;
    if (c.stage !== 'aware' && c.stage !== 'adopter') return c;
    if (territory.flags.length === 0) return c;

    // Count existing owned customers per flagged player
    const customerCounts: Record<string, number> = {};
    for (const flag of territory.flags) customerCounts[flag] = 0;
    for (const customer of customers) {
      if (customer.ownerId && customerCounts[customer.ownerId] !== undefined) {
        customerCounts[customer.ownerId]++;
      }
    }

    // Pick flagged player with most customers (tiebreak: lower index)
    let bestPlayer: string | null = null;
    let bestCount = -1;
    for (const flag of territory.flags) {
      const count = customerCounts[flag] ?? 0;
      if (
        count > bestCount ||
        (count === bestCount &&
          bestPlayer !== null &&
          state.players.findIndex((p) => p.id === flag) <
            state.players.findIndex((p) => p.id === bestPlayer))
      ) {
        bestCount = count;
        bestPlayer = flag;
      }
    }

    return bestPlayer ? { ...c, ownerId: bestPlayer } : c;
  });

  return {
    ...territory,
    customers,
    adoptionFilled,
    saturated,
    subsidyZone,
  };
}

