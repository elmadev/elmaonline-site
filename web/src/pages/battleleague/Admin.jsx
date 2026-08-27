import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import Header from 'components/Header';
import { Grid, Button } from '@material-ui/core';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import Kuski from 'components/Kuski';
import FieldAutoComplete from 'components/FieldAutoComplete';
import ClickToEdit from 'components/ClickToEdit';
import { Dropdown, TextField } from 'components/Inputs';
import LocalTime from 'components/LocalTime';
import { BATTLETYPES_LONG } from 'constants/ranking';
import Loading from 'components/Loading';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ListRow, ListCell } from 'components/List';
import DerpTable from 'components/Table/DerpTable';
import { KuskiAutoComplete } from 'components/AutoComplete';
import { UpdateBattleLeagueWhitelist, UpdateBattleLeagueBreak } from 'api';

const schema = yup.object().shape({
  LevelName: yup.string().required().max(8),
  Season: yup.string().max(15),
  Designer: yup.string().max(15),
  StartDate: yup.date(),
  StartHour: yup.number().min(0).max(23),
});

const DEFAULT_BREAK_MINUTES = 2;

const battleTypes = Object.keys(BATTLETYPES_LONG).map(short => {
  return { id: short, name: BATTLETYPES_LONG[short] };
});

const Admin = ({ BattleLeagueIndex }) => {
  const [type, setType] = useState('NM');
  const [addSeason, setAddSeason] = useState('');
  const [selectedBattle, setSelectedBattle] = useState(0);
  const [whitelist, setWhitelist] = useState([]);
  const [breakLength, setBreakLength] = useState('');
  const {
    battleList,
    league: { loading, data },
  } = useStoreState(state => state.BattleLeague);
  const {
    league: { create, update, remove },
    findBattles,
  } = useStoreActions(actions => actions.BattleLeague);

  useEffect(() => {
    if (Array.isArray(data?.Settings?.whitelist)) {
      const whitelistEntries = [];
      const seen = new Set();

      const addEntry = entry => {
        if (!entry?.KuskiIndex || seen.has(entry.KuskiIndex)) {
          return;
        }
        seen.add(entry.KuskiIndex);
        whitelistEntries.push(entry);
      };
      data.Settings.whitelist.forEach(kuskiIndex => {
        const matchingEntry = (data?.Battles || []).reduce((found, battle) => {
          if (found) {
            return found;
          }
          const resultMatch = (battle.BattleData?.Results || []).find(
            result => result.KuskiData?.KuskiIndex === kuskiIndex,
          );
          return resultMatch?.KuskiData || null;
        }, null);

        addEntry(
          matchingEntry || {
            KuskiIndex: kuskiIndex,
            Kuski: `#${kuskiIndex}`,
          },
        );
      });
      setWhitelist(whitelistEntries);
    } else {
      setWhitelist([]);
    }
  }, [data?.Settings?.whitelist, data?.Battles]);

  useEffect(() => {
    setBreakLength(
      Number.isFinite(data?.Settings?.break) ? String(data.Settings.break) : '',
    );
  }, [data?.Settings?.break]);

  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values =>
        create({ ...values, BattleLeagueIndex, BattleType: type }),
    },
  );

  const addExisting = () => {
    create({
      BattleIndex: selectedBattle,
      Season: addSeason,
      BattleLeagueIndex,
    });
  };

  const whitelistOptions = React.useMemo(() => {
    const options = [];
    const seen = new Set();
    const addOption = item => {
      if (!item?.KuskiIndex || seen.has(item.KuskiIndex)) {
        return;
      }
      seen.add(item.KuskiIndex);
      options.push(item);
    };

    whitelist.forEach(addOption);
    (data?.Battles || []).forEach(battle => {
      (battle.BattleData?.Results || []).forEach(result => {
        addOption(result.KuskiData);
      });
    });

    return options;
  }, [data?.Battles, whitelist]);

  const saveWhitelist = async () => {
    await UpdateBattleLeagueWhitelist({
      BattleLeagueIndex,
      whitelist: whitelist.map(kuski => kuski.KuskiIndex),
    });
  };

  const saveBreak = async () => {
    await UpdateBattleLeagueBreak({
      BattleLeagueIndex,
      break: Number(breakLength) || 0,
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {loading ? (
            <Loading />
          ) : (
            <Paper padding>
              <Header h2>Add upcoming battle</Header>
              <form {...formal.getFormProps()}>
                <Field
                  label="Level Name"
                  {...formal.getFieldProps('LevelName')}
                />
                <Field label="Season" {...formal.getFieldProps('Season')} />
                <Dropdown
                  name="Battle Type"
                  options={battleTypes}
                  selected={type}
                  update={v => setType(v)}
                />
                <Field label="Designer" {...formal.getFieldProps('Designer')} />
                <Field
                  label="Start Date"
                  {...formal.getFieldProps('StartDate')}
                  date
                />
                <Field
                  label="Start Hour"
                  {...formal.getFieldProps('StartHour')}
                />
                <Button variant="contained" onClick={() => formal.submit()}>
                  Add
                </Button>
              </form>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {!loading && (
            <Paper padding>
              <Header h2>Add existing battle</Header>
              <FieldAutoComplete
                label="Level"
                list={battleList}
                getOptions={v => findBattles(v)}
                valueSelected={v => setSelectedBattle(v)}
              />
              <TextField
                name="Season"
                value={addSeason}
                onChange={t => setAddSeason(t)}
              />
              <Button variant="contained" onClick={() => addExisting()}>
                Add
              </Button>
            </Paper>
          )}
          <Paper padding top>
            <Header h2>Add upcoming battle</Header>
            <ol>
              <li>
                To add an upcoming battle use the "Add upcoming battle" form on
                the left.
              </li>
              <li>
                Only Level Name is required, and only Level Name has to match
                exactly with the upcoming battle. The rest is just to give the
                player more information.
              </li>
            </ol>
            <Header h2>Add existing battle</Header>
            <ol>
              <li>
                To add a battle that's already ended, use the "Add existing
                battle" above.
              </li>
              <li>Search for level name and press Enter.</li>
              <li>Pick a battle from the dropdown.</li>
              <li>Type in season if you use seasons.</li>
            </ol>
            <Header h2>Editing battle</Header>
            <ol>
              <li>
                If you made a mistake adding a battle, such as typing wrong
                level name, just delete the battle below and add it again.
              </li>
              <li>
                To edit season for a battle you can click the season below and
                type in a new one.
              </li>
              <li>
                Standings will be updated on the fly as you add and remove
                battles, so you can always make changes after the fact.
              </li>
            </ol>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper padding top>
            <Header h2>Events</Header>
            <DerpTable
              headers={['Level', 'Start', 'Designer', 'Season', 'Delete']}
            >
              {data.Battles.map(e => (
                <ListRow hover key={e.BattleLeagueBattleIndex}>
                  <ListCell>
                    {e.BattleData
                      ? e.BattleData.LevelData.LevelName
                      : e.LevelName}
                  </ListCell>
                  <ListCell>
                    <LocalTime
                      date={e.Started}
                      format="eee d MMM yyyy HH:mm"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>
                    <Kuski
                      kuskiData={
                        e.BattleData ? e.BattleData.KuskiData : e.DesignerData
                      }
                    />
                  </ListCell>
                  <ListCell>
                    <ClickToEdit
                      value={e.Season}
                      allowEmpty
                      update={v =>
                        update({
                          BattleLeagueBattleIndex: e.BattleLeagueBattleIndex,
                          Season: v,
                        })
                      }
                    >
                      {e.Season ? e.Season : 'None'}
                    </ClickToEdit>
                  </ListCell>
                  <ListCell>
                    <Button
                      variant="contained"
                      onClick={() => remove(e.BattleLeagueBattleIndex)}
                    >
                      Delete
                    </Button>
                  </ListCell>
                </ListRow>
              ))}
            </DerpTable>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper padding top>
            <Header h2>Whitelist</Header>
            <p>
              Leave the list empty to allow everyone. Select players to restrict
              participation.
            </p>
            <KuskiAutoComplete
              label="Allowed players"
              list={whitelistOptions}
              selected={whitelist}
              onChange={(_ids, newValue) => setWhitelist(newValue || [])}
              multiple
            />
            <Button
              variant="contained"
              onClick={() => saveWhitelist()}
              style={{ marginTop: 12 }}
            >
              Save whitelist
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper padding top>
            <Header h2>Break length</Header>
            <p>
              Minutes of break kept between battles, used to estimate battle
              start times. Default is {DEFAULT_BREAK_MINUTES} minutes.
            </p>
            <TextField
              name="Break (minutes)"
              value={breakLength}
              onChange={v => setBreakLength(v.replace(/\D/g, ''))}
            />
            <Button
              variant="contained"
              onClick={() => saveBreak()}
              style={{ marginTop: 12 }}
            >
              Save break length
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

export default Admin;
