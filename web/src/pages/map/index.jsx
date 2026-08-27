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
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from '@emotion/styled';

// Fix for Leaflet icon paths in production build
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/images/marker-icon.png',
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});
import { format } from 'date-fns';
import { nickId } from 'utils/nick';
import Layout from 'components/Layout';
import MarkerBike from '../../images/marker-bike.png';

// Custom component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: e => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

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

  const handleMapClick = ({ lat, lng }) => {
    if (nickId() !== 0) {
      setLnglat({ lng, lat });
      setOpen(true);
    }
  };

  // Custom icon for markers
  const bikeIcon = new Icon({
    iconUrl: MarkerBike,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <Layout t="Kuski Map">
      <Container>
        <HeaderContainer>
          <HeadlineContainer>Kuski Map</HeadlineContainer>
          <TextContainer>
            The kuski map is made to visualize where in the world kuskis live
            and maybe inspire irl meetings. To add your marker make sure
            you&apos;re logged in and then simply click on the map.
          </TextContainer>
        </HeaderContainer>
        <StyledMapContainer>
          <MapContainer
            center={[51, 15]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {markerList.map(m => (
              <Marker
                key={`${m.Lat}${m.Lng}`}
                position={[m.Lat, m.Lng]}
                icon={bikeIcon}
              >
                <Popup>
                  {m.KuskiData !== null && m.KuskiData.Kuski} (Added:{' '}
                  {format(new Date(m.LastUpdated * 1000), 'd LLL y')})
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </StyledMapContainer>
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
    </Layout>
  );
};

const StyledMapContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: calc(100vh - 98px);
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 51px);
`;

export default Map;
