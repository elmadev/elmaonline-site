import React, { useState, useEffect } from 'react';
import { Button, Chip, Typography } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import FormResponse from 'components/FormResponse';
import Field from 'components/Field';
import { xor } from 'lodash';

// form to update level pack long name, desc.
const UpdateForm = () => {
  const { updateLevelPack, getTagOptions } = useStoreActions(
    store => store.LevelPack,
  );
  const { levelPackInfo, tagOptions } = useStoreState(store => store.LevelPack);

  const [LevelPackLongName, setLongName] = useState(
    levelPackInfo.LevelPackLongName,
  );

  const [LevelPackDesc, setDesc] = useState(levelPackInfo.LevelPackDesc);
  const [Tags, setTags] = useState(
    levelPackInfo.Tags?.map(tag => tag.TagIndex) || [],
  );

  const [response, setResponse] = useState({});

  useEffect(() => {
    getTagOptions();
  }, []);

  useEffect(() => {
    if (levelPackInfo?.LevelPackLongName && !LevelPackLongName) {
      setLongName(levelPackInfo.LevelPackLongName);
    }
    if (levelPackInfo?.LevelPackDesc && !LevelPackDesc) {
      setDesc(levelPackInfo.LevelPackDesc);
    }

    if (levelPackInfo?.Tags && !Tags.length) {
      setTags(levelPackInfo.Tags.map(tag => tag.TagIndex));
    }
  }, [levelPackInfo]);

  const { errors, done } = response;

  const submit = e => {
    e.preventDefault();

    setResponse({});

    updateLevelPack({
      LevelPackIndex: levelPackInfo.LevelPackIndex,
      LevelPackLongName,
      LevelPackDesc,
      Tags,
    }).then(errors => {
      setResponse({
        done: true,
        errors: errors,
      });
    });
  };

  return (
    <form onSubmit={submit} style={{ display: 'block', width: '100%' }}>
      <Field
        label="Level pack long name"
        value={LevelPackLongName}
        onChange={e => setLongName(e.target.value)}
      />
      <Field
        label="Level pack description"
        value={LevelPackDesc}
        onChange={e => setDesc(e.target.value)}
      />
      <div style={{ padding: '16px' }}>
        <Typography color="textSecondary">Tags</Typography>
        {tagOptions.map(option => {
          if (Tags.includes(option.TagIndex)) {
            return (
              <Chip
                key={option.TagIndex}
                label={option.Name}
                onDelete={() => setTags(() => xor(Tags, [option.TagIndex]))}
                color="primary"
                style={{ margin: 4 }}
              />
            );
          } else {
            return (
              <Chip
                key={option.TagIndex}
                label={option.Name}
                onClick={() => setTags(() => xor(Tags, [option.TagIndex]))}
                style={{ margin: 4 }}
              />
            );
          }
        })}
      </div>

      <Button type="submit" variant="contained" style={{ margin: '10px 0' }}>
        Update
      </Button>
      {done && (
        <>
          <br />
          <br />
          <FormResponse
            msgs={errors.length ? errors : ['Level Pack Updated.']}
            isError={errors.length > 0}
          />
        </>
      )}
    </form>
  );
};

export default UpdateForm;
