import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { nickId } from 'utils/nick';

const Map = () => {
  const [open, setOpen] = useState(false);
  const [lnglat, setLnglat] = useState({ lng: 0, lat: 0 });
  const { markerList } = useStoreState(state => state.KuskiMap);
  const { getMarkers, addMarker } = useStoreActions(
    actions => actions.KuskiMap,
  );

  useEffect(() => {
    getMarkers();
  }, []);

  const save = () => {
    addMarker({
      Lng: lnglat.lng,
      Lat: lnglat.lat,
      LastUpdated: format(new Date(), 't'),
    });
    setOpen(false);
  };
  const isWindow = typeof window !== 'undefined';

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Kuski Map
      </Typography>
      <MapContainer>
        {isWindow && (
          <GoogleMapReact
            bootstrapURLKeys={{ key: window.App.google.maps }}
            defaultCenter={{ lat: 51, lng: 15 }}
            defaultZoom={4}
            onClick={({ lat, lng }) => {
              if (nickId() !== 0) {
                setLnglat({ lng, lat });
                setOpen(true);
              }
            }}
          >
            {markerList.map(m => (
              <Marker key={`${m.Lat}${m.Lng}`} lat={m.Lat} lng={m.Lng}>
                {m.KuskiData.Kuski}
              </Marker>
            ))}
          </GoogleMapReact>
        )}
      </MapContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Marker</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              Pro tip: For safety reasons don&apos;t place your marker on your
              exact location, but somewhere close by. <br />
              <br />
            </div>
            <div>Latitude: {lnglat.lat}</div>
            <div>Longitude: {lnglat.lng}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => save()} color="primary">
            Place marker
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const MapContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Marker = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  border: 1px dashed black;
  background-color: white;
  justify-content: center;
  align-items: center;
  display: flex;
  transform: translate(-10px, -10px);
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 51px);
`;

export default Map;
