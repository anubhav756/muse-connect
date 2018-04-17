import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LearnImage.scss';

export default class LearnImage extends Component {

  render() {
    const { url, ...rest } = this.props;
    const backgroundImage = `url(${url})`;

    return (
      <div className="learn-image" {...rest}>
        <div className="learn-image__image" style={{ backgroundImage }} />
        <div className="learn-image__backdrop" style={{ backgroundImage }} />
      </div>
    );
  }
}

LearnImage.propTypes = {
  url: PropTypes.string
}

LearnImage.defaultProps = {
  url: '/images/learnDefault.jpg'
}
