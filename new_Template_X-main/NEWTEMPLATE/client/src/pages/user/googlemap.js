import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

// Marker component to represent a marker on the map
const Marker = ({ text }) => <div style={{ color: 'red' }}>{text}</div>;

class MapContainer extends Component {
    // Define default props for center and zoom
    static defaultProps = {
        center: {
            lat: 7.281130,
            lng: 80.624740
        },
        zoom: 10
    };

    render() {
        // Ensure GoogleMapReact has the correct props= npm i google-map-react
        return (
            <div style={{ height: '500px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCUU8zkFknNb1Qfk_GxmwYdF9J2sTqUs0E' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    <Marker
                        lat={this.props.center.lat}
                        lng={this.props.center.lng}
                        text="GreenLineTechnology"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default MapContainer;


