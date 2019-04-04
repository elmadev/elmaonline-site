import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Dropzone from 'react-dropzone';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import insertReplay from './upload.graphql';
import updateReplay from './update.graphql';
import Alert from '../Alert';
import Link from '../Link';
import s from './Upload.css';

class Upload extends React.Component {
  static propTypes = {
    onUpload: PropTypes.func,
    filetype: PropTypes.string.isRequired,
    insertReplay: PropTypes.func.isRequired,
    updateReplay: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    onUpload: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      fileInfo: {},
      error: '',
      duplicate: false,
      duplicateText: '',
      duplicateOptions: ['okay'],
      duplicateReplayIndex: 0,
      uploaded: [],
    };
  }

  onDrop(files) {
    this.setState({
      files,
      error: '',
      duplicate: false,
      duplicateReplayIndex: 0,
    });
    const fileInfo = {};
    files.forEach((file, index) => {
      fileInfo[file.name] = {
        name: file.name,
        unlisted: false,
        tas: false,
        bug: false,
        nitro: false,
        drivenBy: '',
        error: 'Kuski not found',
        index,
        kuskiIndex: 0,
        comment: '',
      };
    });
    this.setState({ fileInfo });
  }

  sendMutation = (
    UploadedBy,
    UUID,
    RecFileName,
    Uploaded,
    ReplayTime,
    Finished,
    LevelIndex,
    Unlisted,
    DrivenBy,
    TAS,
    Bug,
    Nitro,
    Comment,
    MD5,
  ) => {
    this.props
      .insertReplay({
        variables: {
          UploadedBy,
          UUID,
          RecFileName,
          Uploaded,
          ReplayTime,
          Finished,
          LevelIndex,
          Unlisted,
          DrivenBy,
          TAS,
          Bug,
          Nitro,
          Comment,
          MD5,
        },
      })
      .then(() => {
        if (this.state.fileInfo[RecFileName].index > -1) {
          const newFiles = this.state.files.slice();
          newFiles.splice(this.state.fileInfo[RecFileName].index, 1);
          this.setState({ files: newFiles });
        }
        const newUploaded = this.state.uploaded.slice();
        // eslint-disable-next-line
        const fullUrl = `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : '')}/r/${UUID}`;
        newUploaded.push({ RecFileName, UUID, url: fullUrl });
        this.setState({ uploaded: newUploaded });
        const { onUpload } = this.props;
        if (onUpload) {
          onUpload();
        }
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  handleUnlisted = name => event => {
    const newFileInfo = this.state.fileInfo;
    newFileInfo[name].unlisted = event.target.checked;
    this.setState({ fileInfo: newFileInfo });
  };

  handleTas = name => event => {
    const newFileInfo = this.state.fileInfo;
    newFileInfo[name].tas = event.target.checked;
    this.setState({ fileInfo: newFileInfo });
  };

  handleBug = name => event => {
    const newFileInfo = this.state.fileInfo;
    newFileInfo[name].bug = event.target.checked;
    this.setState({ fileInfo: newFileInfo });
  };

  handleNitro = name => event => {
    const newFileInfo = this.state.fileInfo;
    newFileInfo[name].nitro = event.target.checked;
    this.setState({ fileInfo: newFileInfo });
  };

  handleComment = name => event => {
    const newFileInfo = this.state.fileInfo;
    newFileInfo[name].comment = event.target.value;
    this.setState({ fileInfo: newFileInfo });
  };

  handleDrivenBy = name => event => {
    const newFileInfo = this.state.fileInfo;
    newFileInfo[name].drivenBy = event.target.value;
    this.setState({ fileInfo: newFileInfo });
    this.props.client
      .query({
        query: gql`
          query kuskiByName($Name: String!) {
            getKuskiByName(Name: $Name) {
              Kuski
              KuskiIndex
            }
          }
        `,
        variables: { Name: event.target.value },
      })
      .then(({ data }) => {
        if (data.getKuskiByName) {
          newFileInfo[name].kuskiIndex = data.getKuskiByName.KuskiIndex;
          newFileInfo[name].error = '';
        } else {
          newFileInfo[name].kuskiIndex = 0;
          newFileInfo[name].error = 'Kuski not found';
        }
        this.setState({ fileInfo: newFileInfo });
      });
  };

  handleAlert(i) {
    const { duplicateReplayIndex } = this.state;
    this.setState({
      files: [],
      error: '',
      duplicate: false,
      duplicateReplayIndex: 0,
    });
    if (i === 1) {
      this.props
        .updateReplay({ variables: { ReplayIndex: duplicateReplayIndex } })
        .then(() => {
          const { onUpload } = this.props;
          if (onUpload) {
            onUpload();
          }
        });
    }
  }

  upload() {
    this.state.files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      data.append('filename', file.name);
      fetch('/upload/replay', {
        method: 'POST',
        body: data,
      }).then(response => {
        response.json().then(body => {
          if (body.error) {
            if (body.error === 'Duplicate') {
              this.setState({ error: body.error, duplicate: true });
              const oldUnlisted = body.replayInfo[0].Unlisted;
              const newUnlisted = +this.state.fileInfo[body.file].unlisted;
              if (oldUnlisted === newUnlisted) {
                this.setState({
                  duplicateText:
                    'Replay already in the database. Upload failed.',
                  duplicateOptions: ['okay'],
                });
              } else if (oldUnlisted === 0 && newUnlisted === 1) {
                this.setState({
                  duplicateText:
                    'Replay already public in database. Upload failed.',
                  duplicateOptions: ['okay'],
                });
              } else if (oldUnlisted === 1 && newUnlisted === 0) {
                this.setState({
                  duplicateText:
                    'Replay already in database, but currently Unlisted. Would you like to make it public?',
                  duplicateOptions: ['Cancel upload', 'Yes'],
                  duplicateReplayIndex: body.replayInfo[0].ReplayIndex,
                });
              }
            } else {
              this.setState({ error: body.error });
            }
          } else {
            this.sendMutation(
              0,
              body.uuid,
              body.file,
              Math.floor(Date.now() / 1000),
              body.time,
              body.finished,
              body.LevelIndex,
              +this.state.fileInfo[body.file].unlisted,
              this.state.fileInfo[body.file].kuskiIndex,
              +this.state.fileInfo[body.file].tas,
              +this.state.fileInfo[body.file].bug,
              +this.state.fileInfo[body.file].nitro,
              this.state.fileInfo[body.file].comment,
              body.MD5,
            );
          }
        });
      });
    });
  }

  render() {
    const { filetype } = this.props;
    const {
      duplicate,
      duplicateOptions,
      duplicateText,
      files,
      uploaded,
    } = this.state;
    return (
      <React.Fragment>
        <section>
          <div className="dropzone">
            <Dropzone
              accept={filetype}
              onDrop={e => this.onDrop(e)}
              multiple={false}
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '100px',
                border: '2px dashed black',
              }}
            >
              <div style={{ padding: '8px' }}>
                Drop replay file here, or click to select file to upload
              </div>
              {this.state.error && (
                <div style={{ padding: '8px', color: 'red' }}>
                  {this.state.error}
                </div>
              )}
            </Dropzone>
          </div>
          {uploaded &&
            this.state.uploaded.map(u => (
              <Card className={s.uploadCard} key={u.RecFileName}>
                <CardContent>
                  <Typography color="textSecondary">{u.RecFileName}</Typography>
                  <Link to={`/r/${u.UUID}`}>
                    <div>{u.url}</div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          {!this.state.files
            ? '<div>None..</div>'
            : this.state.files.map(rec => (
                <Card className={s.uploadCard} key={rec.name}>
                  <CardContent>
                    <Typography color="textSecondary">{rec.name}</Typography>
                    <Grid container spacing={24}>
                      <Grid item xs={12} sm={6}>
                        <div>
                          <TextField
                            id="DrivenBy"
                            label="Driven by"
                            value={this.state.fileInfo[rec.name].drivenBy}
                            onChange={this.handleDrivenBy(rec.name)}
                            margin="normal"
                            helperText={this.state.fileInfo[rec.name].error}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div>
                          <TextField
                            id="Comment"
                            multiline
                            label="Comment"
                            value={this.state.fileInfo[rec.name].comment}
                            onChange={this.handleComment(rec.name)}
                            margin="normal"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.fileInfo[rec.name].unlisted}
                                onChange={this.handleUnlisted(rec.name)}
                                value="unlisted"
                                color="primary"
                              />
                            }
                            label="Unlisted"
                          />
                        </div>
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.fileInfo[rec.name].tas}
                                onChange={this.handleTas(rec.name)}
                                value="tas"
                                color="primary"
                              />
                            }
                            label="TAS"
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.fileInfo[rec.name].bug}
                                onChange={this.handleBug(rec.name)}
                                value="bug"
                                color="primary"
                              />
                            }
                            label="Bug"
                          />
                        </div>
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state.fileInfo[rec.name].nitro}
                                onChange={this.handleNitro(rec.name)}
                                value="nitro"
                                color="primary"
                              />
                            }
                            label="Modded"
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
          <Grid className={s.uploadButtonContainer} container>
            <Grid item xs={12}>
              {files.length > 0 && (
                <React.Fragment>
                  <Button
                    onClick={() => {
                      this.upload();
                    }}
                    style={{ float: 'right' }}
                    variant="contained"
                    color="primary"
                  >
                    Upload
                  </Button>
                  <Button
                    onClick={() => {
                      this.setState({
                        files: [],
                        error: '',
                        duplicate: false,
                        duplicateReplayIndex: 0,
                      });
                    }}
                    style={{ float: 'right', marginRight: '8px' }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </section>
        <Alert
          title="Duplicate replay file"
          open={duplicate}
          text={duplicateText}
          options={duplicateOptions}
          onClose={i => this.handleAlert(i)}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(insertReplay, {
    name: 'insertReplay',
  }),
  graphql(updateReplay, {
    name: 'updateReplay',
  }),
  withApollo,
  withStyles(s),
)(Upload);
