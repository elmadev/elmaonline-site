import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { nickId } from 'utils/nick';
import MarkerBike from '../../images/marker-bike.png';

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
      <HeaderContainer>
        <HeadlineContainer>Kuski Map</HeadlineContainer>
        <TextContainer>
          The kuski map is made to visualize where in the world kuskis live and
          maybe inspire irl meetings. To add your marker make sure you&apos;re
          logged in and then simply click on the map.
        </TextContainer>
      </HeaderContainer>
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
              <Marker
                title={`${m.KuskiData !== null &&
                  m.KuskiData.Kuski} (Added: ${format(
                  new Date(m.LastUpdated * 1000),
                  'd LLL y',
                )})`}
                key={`${m.Lat}${m.Lng}`}
                lat={m.Lat}
                lng={m.Lng}
              />
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

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeadlineContainer = styled.div`
  min-width: 300px;
  font-size: 3rem;
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: 0em;
  margin-bottom: 0.35em;
`;

const TextContainer = styled.div`
  min-width: 300px;
`;

const Marker = styled.div`
  height: 40px;
  width: 40px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  display: flex;
  transform: translate(-20px, -40px);
  background-image: url('${MarkerBike}');
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 51px);
`;

export default Map;
