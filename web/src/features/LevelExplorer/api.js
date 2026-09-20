import { Besttime, LevelPack, useQueryAlt } from 'api';
import config from 'config';

// This endpoint reads pack metadata and level names/order only, not finishes,
// records or play statistics. A supplied ID list needs no metadata request.
export const useExplorerLevels = (levelIds, levelPack, providedLevels) => {
  const needsPack =
    providedLevels === undefined && levelIds === undefined && !!levelPack;
  const query = useQueryAlt(
    ['LevelExplorer', 'pack', levelPack],
    () => LevelPack(encodeURIComponent(levelPack), 1),
    { enabled: needsPack },
  );

  return {
    ...query,
    levels:
      providedLevels !== undefined
        ? providedLevels
        : levelIds !== undefined
          ? [...new Set(levelIds)].map(LevelIndex => ({ LevelIndex }))
          : query.data?.levels || [],
    isPending: needsPack && query.isPending,
    isError: needsPack && query.isError,
  };
};

export const levelPreviewUrl = levelId =>
  `${config.api}level/${encodeURIComponent(levelId)}.png`;

export const useExplorerTopTimes = levelId =>
  useQueryAlt(
    ['LevelExplorer', 'top10', levelId],
    () => Besttime({ levelId, limit: 10, eolOnly: 0 }),
    { enabled: levelId !== undefined },
  );
