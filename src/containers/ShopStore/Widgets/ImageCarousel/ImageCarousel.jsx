import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import _ from 'lodash'
import { FloatingActionButton } from 'material-ui'
import styleVariables from '!!sass-variable-loader!./../../variables.scss'
import { redirectToProductPage } from '../../../../libs/helpers/redirect'
import Icon from '../Icon'
import './ImageCarousel.scss'

export default class ImageCarousel extends React.Component {

  constructor(props) {
    super(props)
    this.handleAfterChange = this.handleAfterChange.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.gotoSlide = this.gotoSlide.bind(this)
    this.state = {
      currentIndex: 0
    }
    this.counter = 0
  }

  componentWillReceiveProps(nextProps) {
    // checks if the active ColorSwitch changes updates the image at slider
    if (nextProps.colorSwitcherIndex !== this.props.colorSwitcherIndex) {
      this.gotoSlide(nextProps.colorSwitcherIndex)
    }
  }

  /*
   * @function gotoSlide directly takes us to the image of which index has passed
   * @param {number} index
   * @memberOf ImageCarousel
   */
  gotoSlide(index) {
    this.refs.slider.slickGoTo(index)
  }

  // call back handler, called with the index of current selected image
  handleAfterChange(index) {
    this.setState({ currentIndex: index })
  }

  // call back handler, called when image get successfuly loaded
  handleImageLoaded(url) {
    if (!this.state[url]) {
      this.setState({ [url]: true })
    }
  }

  render() {
    const { settings, images, id, arrows, pagination } = this.props
    const { currentIndex } = this.state
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }} >
        {
          !_.isEmpty(images) &&
          <div style={{ position: 'relative' }}>
            {/* dots props is fixed to false */}
            <div className="sliderWrapCarousel">
              <Slider {...{ ...settings, dots: false }} ref="slider" afterChange={this.handleAfterChange}>
                {
                  images.map(url => (
                    <img onClick={() => { if (id) { redirectToProductPage(id) } }} alt={'Product'} draggable="false" key={this.counter++} src={url} onLoad={() => this.handleImageLoaded(url)} />
                  ))
                }
              </Slider>
            </div>
            {
              arrows &&
              <div>
                <div style={{ position: 'absolute', top: '30%', left: '-35px' }}>
                  <FloatingActionButton
                    zDepth={0}
                    backgroundColor={'#7d7d7d'}
                    iconStyle={{ height: 20, width: 20 }}
                    disabled={currentIndex - 1 < 0}
                    onClick={() => {
                      let index = currentIndex;
                      this.gotoSlide(--index)
                    }}
                  >
                    <Icon name="chevron-left" fill="white" style={{ height: 14, width: 14, marginTop: 3, marginRight: 1 }} />
                  </FloatingActionButton>
                </div>
                <div style={{ position: 'absolute', top: '30%', right: '-35px' }}>
                  <FloatingActionButton
                    zDepth={0}
                    backgroundColor={'#7d7d7d'}
                    iconStyle={{ height: 20, width: 20 }}
                    disabled={currentIndex + 1 >= images.length}
                    onClick={() => {
                      let index = currentIndex;
                      this.gotoSlide(++index)
                    }}
                  >
                    <Icon name="chevron-right" fill="white" style={{ height: 14, width: 14, marginTop: 3, marginRight: 1 }} />
                  </FloatingActionButton>
                </div>
              </div>
            }
            {
              pagination &&
              <div style={{ textAlign: 'center' }}>
                <Icon name="pagination" callback={index => this.gotoSlide(index)} totalSteps={images.length} activeStep={currentIndex} fill={styleVariables.lightGrey} activeFill={styleVariables.lightGrey} width="43" height="7" />
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

ImageCarousel.defaultProps = {
  id: null,
  pagination: false
}

ImageCarousel.propTypes = {
  id: PropTypes.number,
  settings: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  colorSwitcherIndex: PropTypes.number.isRequired,
  arrows: PropTypes.bool.isRequired,
  pagination: PropTypes.bool
}
