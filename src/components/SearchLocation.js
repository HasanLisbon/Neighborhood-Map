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

