import React, { Component } from 'react';
import './App.css';
import Map from './components/Map.js'
import SearchLocation from './components/SearchLocation.js'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMapMarkedAlt,faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import * as LocationAPI from "./LocationAPI.js";

library.add(faMapMarkedAlt, faEnvelope, faKey);



class App extends Component {
  state = {
  locations: [],
  originalLocations: [],
  selectedLocation: {},
  newCenter: { lat: 38.7223, lng: -9.1393 },
  isOpen: false,
  defaultCenter: { lat: 38.7223, lng: -9.1393 },
  showInfoIndex: -1,
  markerIcon:{},
  zoom:17,
  defaultZoom: 15,
  selectedColorBlack: true,
  menuHidden: true
}
  componentWillMount() {
    let icon = {
      url: 'http://maps.gstatic.com/mapfiles/markers2/boost-marker-mapview.png'//'http://maps.gstatic.com/mapfiles/markers2/boost-marker-mapview.png' //'http://maps.gstatic.com/mapfiles/markers2/marker.png'//'http://maps.google.com/mapfiles/ms/icons/POI.shadow.png' //google.maps.SymbolPath.CIRCLE, //FORWARD_CLOSED_ARROW
    }
    this.setState({
      markerIcon: icon,
      defaultMarkerIcon: icon
    })
  }
componentDidMount() {

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  LocationAPI.getLocationsAll()
    .then((locations) => {
      this.setState({ locations })
      console.log(locations)

      this.setState({ originalLocations: locations })
    }).catch((error) => {
      alert('Error While getting All Locations data from FourSquare API >> Sorry!! Locations Data Will not be loaded or displayed ')
      console.log('Error While Getting All Locations')

    })
}
  updateLocations = (searchResultArr, query) => {
    if (query) {
      this.setState((state) => ({
        locations: searchResultArr
      }))
    } else {
      this.setState({ locations: this.state.originalLocations })
    }
  }
  handleLocationSelected = (event, location, index) => {
    if (event.key === 'Enter') {
      //console.log('[app.js] Enter Key Pressed ', location)
      //this.setNewCenter(location)
      let newCenter = { lat: 38.7223, lng: -9.1393 };
      if (location !== undefined && location.location !== undefined) {
        newCenter = { lat: location.location.lat, lng: location.location.lng }
      }
      this.handleMarkerClicked(event, this.state.newCenter, index)
    }
  }
  setNewCenter = (location) => {
    let newCenter = { lat: 38.7223, lng: -9.1393 };
    if (location !== undefined && location.location !== undefined) {
      newCenter = { lat: location.location.lat, lng: location.location.lng }
    }
    this.setState({
      newCenter: newCenter
    })
  }
    handleLocationItemClick = (event, location, index) => {
      //console.log('App.js selectedLocation index ', index)
      //this.setNewCenter(location)
      let newCenter = { lat: 38.7223, lng: -9.1393 };
      if (location !== undefined && location.location !== undefined) {
        newCenter = { lat: location.location.lat, lng: location.location.lng }
      }
      this.handleMarkerClicked(event, newCenter, index)

    }
    handleShowInfo = (indx) => {
      this.setState({
        isOpen: !this.state.isOpen,
        showInfoIndex: indx
      })
    }

  handleMarkerClicked = (event, latlng, indx) => {
    let goldStar = {
      path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 0.1,
      strokeColor: 'gold',
      strokeWeight: 3
    };
    //console.log('Marker clicked ', latlng, indx, this.state.isOpen)
    this.setState({
      //isOpen : !this.state.isOpen,
      showInfoIndex: indx.index,
      newCenter: latlng,
      markerIcon: goldStar,
      zoom: 17
    })
    //this.changeLocationColor()
  }
    resetCenter = () => {
      // console.log('resetting center to ' , this.state.defaultCenter)
      this.setState({
        newCenter: this.state.defaultCenter
      })
    }
    handleToggleOpen = (event, latlng, indx) => {
      this.setState({
        //isOpen: !this.state.isOpen,
        markerIcon: this.state.defaultMarkerIcon,
        zoom: this.state.defaultZoom,
        showInfoIndex: -1
      })
      this.resetCenter();
    }
    // handleNavMenuToggle = (event) => {
    //   //Get PlaceList Nav Menu Bar
    //   let placesNavMenu = document.querySelector("ul.location-list")
    //   placesNavMenu.classList.toggle('open')
    //   event.stopPropagation();
    //   this.setState({
    //     menuHidden: !this.state.menuHidden
    //   })
    // }
  changeLocationColor = () => {
    this.setState({ selectedColorBlack: !this.state.selectedColorBlack })
  }
  render() {
    let color = this.state.selectedColorBlack ? "locations-list": "selectedcolor"
    let viewIndex = 0
    if (this.state.menuHidden) {
      viewIndex = -1
    }
    return <div className="App">
      
          <SearchLocation 
          locations={this.state.locations} 
          onUserDidSearch={this.updateLocations} 
          onhandleLocationSelected={this.handleLocationSelected} 
          onItemClick={this.handleLocationItemClick} 
          menuHidden={this.state.menuHidden} />
       
        {navigator.onLine && <Map 
        locations={this.state.locations} 
        newCenter={this.state.newCenter} 
        onMarkerClick={this.handleMarkerClicked} 
        onToggleOpen={this.handleToggleOpen} 
        showInfoIndex={this.state.showInfoIndex} 
        markerIcon={this.state.markerIcon}
        zoom={this.state.zoom} />}
        {!navigator.onLine && <div>
            <h2>Map is offline</h2>
          </div>}
      </div>;
  }
}
export default App