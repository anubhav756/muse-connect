import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import _ from 'lodash'
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss'

import Icon from '../../components/Icon'
import './ImageCarousel.scss'

export default class ImageCarousel extends React.Component {

  constructor(props) {
    super(props)
    this.handleAfterChange = this.handleAfterChange.bind(this)
    this.state = {
      currentIndex: 0
    }
  }

  handleAfterChange(index) {
    this.setState({ currentIndex: index })
  }

  render() {
    const { settings, images } = this.props
    const { currentIndex } = this.state
    return (
      <div>
        {
          !_.isEmpty(images) &&
          <div>
            {/* dots props is fixed to false */}
            <Slider {...{ ...settings, dots: false }} afterChange={this.handleAfterChange}>
              {
                images.map(url => (
                  <img alt={'Product'} key={url} src={url} />
                ))
              }
            </Slider>
            <div style={{ textAlign: 'center' }}>
              <Icon name="pagination" totalSteps={images.length} activeStep={currentIndex} fill={styleVariables.lightGrey} activeFill={styleVariables.lightGrey} width="43" height="7" />
            </div>
          </div>
        }
      </div>
    )
  }
}

ImageCarousel.propTypes = {
  settings: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired
}
