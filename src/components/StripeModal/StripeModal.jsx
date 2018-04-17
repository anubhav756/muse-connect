import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import {
  saveToken as _saveToken,
  usePromo as _usePromo
} from '../../redux/modules/subscription';
import { capitalize } from '../../libs/helpers/common';

class StripeModal extends Component {
  constructor() {
    super();

    this.state = {
      tokenReceived: false,
      forceOpenModal: false
    };

    this.onToken = this.onToken.bind(this);
    this.onClose = this.onClose.bind(this);
    this.getCheckoutURL = this.getCheckoutURL.bind(this);
  }
  onToken({ id: token }) {
    const {
      planID,
      user: { email },
      saveToken,
      promoID,
      purID,
      callback
    } = this.props;

    this.setState({ tokenReceived: true });

    saveToken({
      email,
      token,
      planID,
      ...(promoID ? { promoID } : null),
      ...(purID ? { purID } : null)
    },
      callback
    );
  }
  onClose() {
    const { callback } = this.props;
    const { tokenReceived } = this.state;

    if (!tokenReceived)
      callback(true);

    this.setState({ tokenReceived: false, forceOpenModal: false });
  }
  getCheckoutURL() {
    const { promoID, usePromo, callback } = this.props;

    usePromo(promoID, (err, checkoutURL) => {
      if (err) {
        return callback(err);
      }

      if (checkoutURL) {
        window.open(checkoutURL, '_self');
      } else {
        this.setState({ forceOpenModal: true }, () => this.setState({ forceOpenModal: false }));
      }
    });
  }
  render() {
    const {
      title,
      button: _button,
      disabled,
      amount,
      trialDays,
      currency,
      user: { email },
      stripeKey,
      promoID,
      frequency
    } = this.props;
    const { forceOpenModal } = this.state;
    const button = React.cloneElement(_button, { disabled });

    if (!forceOpenModal) {
      if (disabled)
        return button;

      if (promoID)
        return <div onClick={this.getCheckoutURL}>{button}</div>;
    }

    let panelLabel = trialDays ? '$0.00 - Start Free Trial' : frequency || 'Pay';
    panelLabel = capitalize(panelLabel);

    return (
      <StripeCheckout
        name="Muse"
        desktopShowModal={forceOpenModal}
        description={title}
        image="https://www.choosemuse.com/wp-content/uploads/2014/10/muse_logo_noTag1.png"
        panelLabel={panelLabel}
        amount={trialDays ? null : parseFloat(amount) * 100}
        currency={currency}
        stripeKey={stripeKey}
        email={email}
        token={this.onToken}
        triggerEvent="onClick"
        opened={this.onOpen}
        closed={this.onClose}
      >
        {button}
      </StripeCheckout>
    );
  }
}
function enabledOnlyProp(props, propName) {
  if (!props.disabled && !props[propName])
    return new Error(`"${propName}" required when "disabled" is set to true`);
}

StripeModal.propTypes = {
  planID: PropTypes.string,
  title: PropTypes.string,
  button: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  frequency: PropTypes.string,
  trialDays: PropTypes.number,
  amount: enabledOnlyProp,
  currency: enabledOnlyProp,
  stripeKey: enabledOnlyProp,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired
  }).isRequired,
  saveToken: PropTypes.func.isRequired,
  usePromo: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  promoID: PropTypes.string,
  purID: PropTypes.string
}
StripeModal.defaultProps = {
  title: 'Muse',
  trialDays: 0,
  disabled: false,
  checkoutURL: '',
  frequency: null,
  amount: 0,
  currency: 'USD',
  stripeKey: null,
  planID: null,
  promoID: null,
  purID: null
}

export default connect(
  null,
  ({
    saveToken: _saveToken,
    usePromo: _usePromo
  })
)(StripeModal);
