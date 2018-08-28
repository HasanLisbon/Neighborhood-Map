import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types'
import sortBy from 'sort-by'
import escapeRegExp from 'escape-string-regexp'
import * as LocationAPI from '../LocationAPI.js'
import Location from './Location.js'
import KeyboardEventHandler from 'react-keyboard-event-handler';

export default class SearchLocation extends Component{
    static propTypes = {
        //locations: PropTypes.array.isRequired,
        onUserDidSearch: PropTypes.func.isRequired,
        onhandleLocationSelected: PropTypes.func.isRequired
    }

    state = {
        query: '',
        locationsSearchResult: []
    }

    updateQuery = (query) => {
        this.setState({
            query: query
        })
    }

    clearQuery = () => {
        this.state({
            query: ''
        })
    }


    searchLocations = (query) => {
        let filteredLocations
        let locations = this.props.locations
        let locationsHasItems = false
        let result = {}
        if (locations !== undefined && locations !== null && locations.length > 0) {
            locationsHasItems = true
            locations.sort(sortBy('name'))
        }
        if (query) {
            const match = new RegExp(escapeRegExp(query.trim()), 'i')
            if (locationsHasItems) {
                filteredLocations = locations.filter((location) => match.test((location.name)))
            }
        } else {
            filteredLocations = locations
        }

        result = { locationsHasItems: locationsHasItems, filteredLocations: filteredLocations }
        return result
    }

    handleTextChange = (query, event) => {
        //console.log('query is'+ query)
        this.updateQuery(query)
        let result = this.searchLocations(query)
        this.props.onUserDidSearch(result.filteredLocations, query)
        this.setState({ locationsSearchResult: result.filteredLocations })
    }
    handleNavMenuToggle = (event) => {
        //Get PlaceList Nav Menu Bar
        let placesNavMenu = document.querySelector("#location-list");
        placesNavMenu.classList.toggle('open')
        event.stopPropagation();
        this.setState({
            menuHidden: !this.state.menuHidden
        })
    }
    render(){
        let { locations, onUserDidSearch, onhandleLocationSelected, onItemClick, color, menuHidden } = this.props
        let { query, locationsSearchResult } = this.state
        let result = this.searchLocations(query)
        let locationsHasItems = result.locationsHasItems
        let filteredLocations = result.filteredLocations
        const { onMenuClick } = this.props

        let handleKeyPress = (event, location, index) => {
            onhandleLocationSelected(event, location, index)
        }
        let onItemClickHandler = (event, location, index) => {
            onItemClick(event, location, index)
        }
        let viewIndex = 0
        if (menuHidden) {
            viewIndex = -1
        }
        return (<section className="list-box">
            <form className="form-group has-feedback list-form" tabIndex={viewIndex} aria-hidden={menuHidden} onSubmit={event => event.preventDefault()}>
              <input placeholder="Search location here" className="form-control list-input" onChange={event => this.handleTextChange(event.target.value, event)} />
                <button className="list-btn" onClick={this.handleNavMenuToggle}>
                <FontAwesomeIcon id="menu" icon="map-marked-alt" size="md" color="green" className="icon" />
              </button>
            </form>
            {(locationsHasItems) && (
                <ul id="location-list" className="locations-list" aria-hidden={menuHidden} tabIndex={viewIndex} role="menu" arial-label="List Of neighbourhood places">
                    <h3>Restaurant List</h3>
                  {filteredLocations.map((item, index) => (
                    <Location
                      key={index}
                      role="menu item"
                      menuHidden={menuHidden}
                      viewIndex={viewIndex}
                      location={item}
                      index={index}
                      onClick={onItemClickHandler}
                      onKeyPress={handleKeyPress}
                    />
                  ))}
                </ul>
            )}
            </section>
        );
        
    }
}
// import React, { Component } from "react";
// import escapeRegExp from "escape-string-regexp";
// import Location from "./CompositeGoogleMap";

// class Filter extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             query: "",
//             locationsFiltered: Location,
//             markersFiltered: [],
//             nowmarker: {},
//             listOpened: true
//         };
//     }

//     componentDidMount() {
//         //When the app loads the markersFiltered state is passed to the props
//         this.setState({
//             markersFiltered: this.props.markers
//         });
//     }

//     handleChangedQuery = query => {
//         // Handling any changes to the query
//         this.setState({
//             query,
//             listOpened: true
//         });

//         // Changing how the list is appearing on the app
//         if (query === "") {
//             this.setState({
//                 listOpened: false
//             });
//         }
//         this.updateLocations(query);
//     };

//     updateList = () => {
//         this.setState(prevState => ({
//             listOpened: !prevState.listOpened
//         }));
//     };

//     updateLocations = query => {
//         //Handling the state of the locations
//         let updateThis = this;
//         let fLocations;
//         let fMarkers;

//         if (query) {
//             const match = new RegExp(escapeRegExp(query), "i");

//             // Adding a location to the array if its the same as the query
//             fLocations = this.props.list.filter(location =>
//                 match.test(location.type)
//             );

//             // Adding a marker to the array if its the same as the query
//             fMarkers = this.props.markers.filter(marker => match.test(marker.type));

//             this.setState({
//                 locationsFiltered: fLocations,
//                 markersFiltered: fMarkers
//             });
//         } else {
//             this.setState({
//                 locationsFiltered: this.props.list,
//                 markersFiltered: this.props.markers
//             });
//         }

//         // Showing the markers on the map depending on their current state
//         this.props.markers.map(marker => marker.setVisible(false));
//         setTimeout(function () {
//             updateThis.props.markers.map(marker => updateThis.markerVisible(marker));
//         }, 1);
//     };

//     markerVisible = marker => {
//         // The markers who match now show up on the map
//         this.state.markersFiltered.map(
//             markerFiltered =>
//                 markerFiltered.id === marker.id && marker.setVisible(true)
//         );
//     };

//     markerClicked = location => {
//         // Handling how the markers animate when they are clicked on
//         let updateThis = this;

//         this.removeMarker();
//         this.addMarker(location);
//         setTimeout(function () {
//             updateThis.removeMarker();
//         }, 1250);

//         //Getting the marker that is clicked and opening the correct infowindow
//         this.getMarkerNow(location);

//         setTimeout(function () {
//             updateThis.props.openBox(updateThis.state.nowmarker);
//             updateThis.props.openBox(location);
//         }, 1);
//     };

//     removeMarker = () => {
//         //Removing the marker's animations
//         this.state.markersFiltered.map(markerFiltered =>
//             markerFiltered.setAnimation(null)
//         );
//     };

//     addMarker = location => {
//         // Adding animations to a showing marker
//         this.state.markersFiltered.map(
//             markerFiltered =>
//                 markerFiltered.id === location.key &&
//                 markerFiltered.setAnimation(window.google.maps.Animation.BOUNCE)
//         );
//     };

//     getMarkerNow = location => {
//         //Clicking the marker will give the information in the infowindow
//         this.state.markersFiltered.map(
//             markerFiltered =>
//                 markerFiltered.id === location.key &&
//                 this.setState({
//                     nowmarker: markerFiltered
//                 })
//         );
//     };

//     render() {
//         const { query, locationsFiltered, listOpened } = this.state;

//         return (
//             <section className="list-box">
//                 <form className="list-form" onSubmit={event => event.preventDefault()}>
//                     <button className="list-btn" onClick={() => this.updateList()}>
//                         List
//           </button>

//                     <input
//                         className="list-input"
//                         aria-labelledby="filter"
//                         type="text"
//                         placeholder="Search for locations..."
//                         value={query}
//                         onChange={event => this.handleChangedQuery(event.target.value)}
//                     />
//                 </form>

//                 {listOpened && (
//                     <ul className="locations-list">
//                         {locationsFiltered.map(location => (
//                             <li
//                                 tabIndex={0}
//                                 role="button"
//                                 className="location-item"
//                                 key={location.key}
//                                 onClick={() => this.markerClicked(location)}
//                                 onKeyPress={() => this.markerClicked(location)}
//                             >
//                                 {location.name}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </section>
//         );
//     }
// }

// export default Filter;
