import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as LocationAPI from '../LocationAPI.js';
import ImageViewer from './ImageViewer.js'

class InfoWindowContent extends Component {
    static propTypes = {
    }
    state = {
        imageSrc: {},
        venueDetails: {},
        detailsString: '',
        success: false
    }
    componentWillMount() {
        let img
        let constructString


        function handleErrors(response) {
            if (response === undefined) {
                console.log('[Venue details ]response status Text', response)
                this.setState({
                    success: false
                })
                throw Error(response.statusText);
            }
            return response;
        }

        LocationAPI.getVenueDetails(this.props.venueId)
            .then(handleErrors)
            .then(data => {
                console.log(data)
                if (data !== undefined && data !== null) {
                    const bestPhoto = data.bestPhoto
                    if (bestPhoto !== undefined && bestPhoto !== null) {
                        img = `${bestPhoto.prefix}${bestPhoto.width}x${bestPhoto.height}${bestPhoto.suffix}`
                    } else {
                        img = process.env.PUBLIC_URL + '/no-photo-available.jpg'
                    }

                    let isOpen = ((data.hours !== undefined && data.hours.status)) ? 'Working Hours: ' + data.hours.status : 'Un available working hours'
                    let address = ((data.location !== undefined && data.location.address) ? 'Address: ' + data.location.address : '')
                    let phone = ((data.contact !== undefined && data.contact.phone) ? 'Phone: ' + data.contact.phone : '')
                    let likes = ((data.likes !== undefined && data.likes.count) ? 'Likes :' + data.likes.count : '')
                    let rating = (data.rating !== undefined ? 'Rating :' + data.rating : '')
                    constructString = `${phone}   ${address} 
						  ${likes}  
						  ${rating} ${isOpen} Time Zone: ${data.timeZone}`

                }
                this.setState({
                    success: true,
                    venueDetails: data,
                    imageSrc: img,
                    detailsString: constructString
                })
            }).catch(error => {
                console.log(`Error while Getting Venue Details FourSquareService May Be un reachable or unavailable `, error)
                alert('Error while Getting Venue Details FourSquareAPiService may be un reachable or unavailable')
                this.setState({
                    success: false
                })
            })
    }
    componentDidMount() {

    }

    render() {
        const { title, latlng, venueId } = this.props

        return (
            <div className="picture-Style" tabIndex={0} aria-label="Info window">
                <div className="window-title" tabIndex={0}> {title}	</div>
                {
                    (this.state.success) && (this.state.imageSrc !== undefined && this.state.imageSrc !== null) && (
                        <ul id="images-list" tabIndex={0}>
                            <ImageViewer imageSrc={this.state.imageSrc}
                                detailsData={this.state.detailsString} >
                            </ImageViewer>

                        </ul>)
                }
                {(!this.state.success) &&
                    (<div className="load-failed">Failed to Load data from foursquare API to get Venue details</div>)}
            </div>
        )
    }
}

export default InfoWindowContent