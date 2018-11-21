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
import s from './Upload.css';

class Upload extends React.Component {
  static propTypes = {
    filetype: PropTypes.string.isRequired,
    insertReplay: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = { files: [], fileInfo: {}, error: '' };
  }

  onDrop(files) {
    this.setState({ files });
    const fileInfo = {};
    files.forEach((file, index) => {
      fileInfo[file.name] = {
        name: file.name,
        unlisted: false,
        drivenBy: '',
        error: 'Kuski not found',
        index,
        kuskiIndex: 0,
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
        },
      })
      .then(() => {
        if (this.state.fileInfo[RecFileName].index > -1) {
          const newFiles = this.state.files.slice();
          newFiles.splice(this.state.fileInfo[RecFileName].index, 1);
          this.setState({ files: newFiles });
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
          );
        });
      });
    });
  }

  render() {
    const { filetype } = this.props;
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            accept={filetype}
            onDrop={e => this.onDrop(e)}
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '100px',
              border: '2px dashed black',
            }}
          >
            <div style={{ padding: '8px' }}>
              Drop replay files here, or click to select files to upload
            </div>
            {this.state.error && (
              <div style={{ padding: '8px' }}>{this.state.error}</div>
            )}
          </Dropzone>
        </div>
        <Grid className={s.uploadButtonContainer} container>
          <Grid item xs={6}>
            <Typography
              className={s.uploadedFiles}
              variant="subheading"
              gutterBottom
            >
              Selected files
            </Typography>
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
        </Grid>
        {!this.state.files
          ? '<div>None..</div>'
          : this.state.files.map(rec => (
              <Card className={s.uploadCard} key={rec.name}>
                <CardContent>
                  <Typography color="textSecondary">{rec.name}</Typography>
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
                </CardContent>
              </Card>
            ))}
      </section>
    );
  }
}

export default compose(
  graphql(insertReplay, {
    name: 'insertReplay',
  }),
  withApollo,
  withStyles(s),
)(Upload);
