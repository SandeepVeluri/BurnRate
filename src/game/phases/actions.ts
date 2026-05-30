import type { GameState, Territory, Player, GameLogEntry } from '../types';

/** Apply subsidize action for a player on a territory. Returns new GameState. */
export function applySubsidize(state: GameState, playerId: string, territoryId: string): GameState {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) throw new Error('Player not found');

  const player = state.players[playerIndex];
  const territoryIndex = state.territories.findIndex((t) => t.id === territoryId);
  if (territoryIndex === -1) throw new Error('Territory not found');

  const territory = state.territories[territoryIndex];

  if (player.cash < 3) throw new Error('Not enough cash');
  if (territory.saturated) throw new Error('Territory is saturated');

  // Update player
  const hasFlag = territory.flags.includes(playerId);
  const newFirstMoverTokens = hasFlag
    ? player.firstMoverTokens
    : [...player.firstMoverTokens, territoryId];

  const updatedPlayer: Player = {
    ...player,
    cash: player.cash - 3,
    flagsRemaining: hasFlag ? player.flagsRemaining : player.flagsRemaining - 1,
    firstMoverTokens: newFirstMoverTokens,
  };

  // Update territory
  const newAdoptionFilled = Math.min(10, territory.adoptionFilled + 2);
  const newFlags = hasFlag ? territory.flags : [...territory.flags, playerId];
  const newSubsidyZone = {
    ...territory.subsidyZone,
    [playerId]: (territory.subsidyZone[playerId] ?? 0) + 3,
  };
  const updatedTerritory: Territory = {
    ...territory,
    adoptionFilled: newAdoptionFilled,
    saturated: newAdoptionFilled >= 10,
    flags: newFlags,
    subsidyZone: newSubsidyZone,
  };

  // Track subsidizedThisRound
  const existing = state.subsidizedThisRound[playerId] ?? [];
  const newSubsidizedThisRound = {
    ...state.subsidizedThisRound,
    [playerId]: [...existing, territoryId],
  };

  const logEntry: GameLogEntry = {
    round: state.round,
    phase: 'actions',
    message: `${player.name} subsidized ${territory.name} (-$3${!hasFlag ? ', planted flag, +1 first mover token' : ''})`,
  };

  const newPlayers = [...state.players];
  newPlayers[playerIndex] = updatedPlayer;
  const newTerritories = [...state.territories];
  newTerritories[territoryIndex] = updatedTerritory;

  return {
    ...state,
    players: newPlayers,
    territories: newTerritories,
    subsidizedThisRound: newSubsidizedThisRound,
    log: [...state.log, logEntry],
  };
}

/** Apply wait action for a player. Returns new GameState. */
export function applyWait(state: GameState, playerId: string): GameState {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) throw new Error('Player not found');
  const player = state.players[playerIndex];

  const updatedPlayer: Player = { ...player, cash: player.cash + 2 };
  const newPlayers = [...state.players];
  newPlayers[playerIndex] = updatedPlayer;

  const logEntry: GameLogEntry = {
    round: state.round,
    phase: 'actions',
    message: `${player.name} waited (+$2)`,
  };

  return {
    ...state,
    players: newPlayers,
    log: [...state.log, logEntry],
  };
}
