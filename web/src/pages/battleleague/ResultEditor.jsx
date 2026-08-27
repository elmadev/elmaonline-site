import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import Time from 'components/Time';
import { UpdateBattleLeagueResultOverride } from 'api';

const ResultEditor = ({
  result,
  canEdit,
  battleLeagueBattleIndex,
  onSaved,
  battleLeagueIndex,
  isNewEntry = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState(
    result?.Time ? String(result.Time) : '',
  );
  const [editDnf, setEditDnf] = useState(Boolean(result?.DNF));
  const [editName, setEditName] = useState(result?.KuskiData?.Kuski || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsEditing(false);
    setEditTime(result?.Time ? String(result.Time) : '');
    setEditDnf(Boolean(result?.DNF));
    setEditName(result?.KuskiData?.Kuski || '');
  }, [result?.BattleTimeIndex]);

  const handleSave = async () => {
    const parsedTime = editDnf ? 0 : Number(editTime);
    if (!editDnf && (!Number.isInteger(parsedTime) || parsedTime < 0)) {
      return;
    }

    if (!battleLeagueBattleIndex) {
      return;
    }

    if (isNewEntry && !editName.trim()) {
      return;
    }

    setIsSaving(true);
    await UpdateBattleLeagueResultOverride({
      BattleLeagueBattleIndex: battleLeagueBattleIndex,
      KuskiIndex: result?.KuskiIndex || 0,
      Time: editDnf ? 0 : parsedTime,
      DNF: editDnf,
      BattleLeagueIndex: battleLeagueIndex,
      Kuski: isNewEntry ? editName.trim() : '',
    });
    setIsSaving(false);
    setIsEditing(false);
    onSaved?.();
  };

  const handleDelete = async () => {
    if (!battleLeagueBattleIndex) {
      return;
    }

    setIsSaving(true);
    await UpdateBattleLeagueResultOverride({
      BattleLeagueBattleIndex: battleLeagueBattleIndex,
      KuskiIndex: result?.KuskiIndex || 0,
      Time: -1,
      DNF: false,
      BattleLeagueIndex: battleLeagueIndex,
      Kuski: '',
    });
    setIsSaving(false);
    setIsEditing(false);
    onSaved?.();
  };

  if (isEditing) {
    return (
      <EditResult>
        {isNewEntry && (
          <TextField
            value={editName}
            onChange={e => setEditName(e.target.value)}
            label="Kuski"
            size="small"
            variant="outlined"
          />
        )}
        <TextField
          value={editTime}
          onChange={e => setEditTime(e.target.value)}
          type="number"
          size="small"
          disabled={editDnf}
          inputProps={{ min: 0, step: 1 }}
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={editDnf}
              onChange={e => setEditDnf(e.target.checked)}
              color="primary"
            />
          }
          label="DNF"
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
        >
          Save
        </Button>
        <Button
          size="small"
          onClick={() => setIsEditing(false)}
          disabled={isSaving}
        >
          Cancel
        </Button>
        {!isNewEntry && (
          <Button
            size="small"
            color="secondary"
            onClick={handleDelete}
            disabled={isSaving}
          >
            Delete
          </Button>
        )}
      </EditResult>
    );
  }

  if (isNewEntry) {
    return (
      <Button
        size="small"
        variant="contained"
        onClick={() => canEdit && setIsEditing(true)}
        disabled={!canEdit}
      >
        Add player
      </Button>
    );
  }

  return (
    <ResultValue
      canEdit={canEdit}
      onDoubleClick={() => canEdit && setIsEditing(true)}
    >
      {result?.DNF ? (
        'DNF'
      ) : (
        <Time time={result?.Time} apples={result?.Apples} />
      )}
    </ResultValue>
  );
};

const EditResult = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ResultValue = styled.span`
  cursor: ${({ canEdit }) => (canEdit ? 'pointer' : 'default')};
`;

export default ResultEditor;
