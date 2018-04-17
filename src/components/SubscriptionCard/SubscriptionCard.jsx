import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Checkbox from 'material-ui/Checkbox'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import Icon from './../Icon'
import './SubscriptionCard.scss'
import Modal from '../../components/Modal'
import StripeModal from '../../components/StripeModal'

export default class SubscriptionCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false,
      termsAccepted: false,
      accordionOpen: false
    }
    this._toggleModal = this._toggleModal.bind(this)
    this._handleTermsCheck = this._handleTermsCheck.bind(this)
    this._handleSelect = this._handleSelect.bind(this)
  }

  _toggleModal() {
    const { modalOpen } = this.state
    this.setState({ modalOpen: !modalOpen, termsAccepted: false })
  }

  _handleSelect(plan) {
    const { termsModal, onSelected } = this.props
    if (termsModal) {
      this._toggleModal()
    }
    if (onSelected) {
      onSelected(plan)
    }
  }

  _handleTermsCheck(event, checked) {
    this.setState({ termsAccepted: checked })
  }

  render() {
    const { title, description,
      price, subtext,
      selected, buttonLabel,
      disableSelect,
      header, moreInfo, mainInfo,
      plan, style,
      detailStyle, frequency,
      infoClassName, buttonStyle,
      tax, replaceAmount, replacementAmount
    } = this.props
    const { modalOpen, termsAccepted, accordionOpen } = this.state
    const True = true

    return (
      <Paper style={{ backgroundColor: 'white', ...style }}>
        <Modal
          toggleModal={this._toggleModal}
          title={'Terms of Service'}
          open={modalOpen}
          autoScrollBodyContent={false}
          titleStyle={{ fontFamily: 'proxima_novaLight', fontWeight: '600', letterSpacing: '0.8px' }}
          style={{ maxWidth: '440px' }}
          childrenStyle={{ paddingLeft: '26px' }}
          iconName="x-grey-icon"
        >
          <div style={{ fontSize: '14px', color: colors.darkGrey }}>
            <div>
              Before proceeding with payment, you must accept the
              <span style={{ color: colors.teal }}> terms of service</span>.
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <Checkbox
                  label={'I have read and accepted the terms of service.'}
                  labelStyle={{ lineHeight: '18px' }}
                  iconStyle={{ fill: colors.lightGrey }}
                  onCheck={this._handleTermsCheck}
                />
              </div>
            </div>
            <div style={{ marginTop: '10px' }} className="clearfix">
              <div style={{ display: 'inline-block', float: 'right' }}>
                {/* Example usage for <StripeModal /> wrapper */}
                <StripeModal
                  title="INTRODUCTORY OFFER"
                  amount="39.99"
                  currency="CAD"
                  checkoutURL=""
                  frequency="annual"
                  stripeKey="pk_test_ovxGRaOhNaOZZ2gtKHWpJqUv"
                  user={{ email: 'jasna@interaxon.ca' }}
                  trialDays={30}
                  disabled={!termsAccepted}
                  callback={() => { }}
                  button={
                    <RaisedButton
                      primary={True}
                      label={<span className="actionModalSubscriptionCard">Proceed to payment</span>}
                    />
                  }
                />
                {/* ////////// */}
              </div>
            </div>
          </div>
        </Modal>
        <div className={selected ? 'selectedSubscription' : ''}>
          <div style={{ marginBottom: header ? '' : '40px' }}>
            {
              header &&
              <div className="headerSubscriptionCard">
                <span className="headerTextSubscriptionCard">{header}</span>
              </div>
            }
          </div>
          <div className="detailsSubscriptionCard" style={{ ...detailStyle }}>
            {
              title &&
              <div style={{ fontSize: '16px', fontFamily: 'proxima_novaSemibold' }}>{title}</div>
            }
            <div className="descriptionDetailsSubscriptionCard">
              {description && description}
            </div>
            <div className="priceDetailsSubscriptionCard">
              {replaceAmount ? `$${replacementAmount}` : `$${price}`}
            </div>
            <div className="subtextDetailsSubscriptionCard">
              {replaceAmount ? `*$${price} ${frequency} charged after trial` : tax ? `(+ $${tax} taxes)` : ' '}
              <br />
              {subtext && subtext}
            </div>
            <div className="actionSubscriptionCard">
              {
                !disableSelect &&
                <FlatButton
                  label={buttonLabel}
                  labelStyle={selected ? { color: colors.teal } : { color: disableSelect ? colors.mediumGrey : colors.teal, fontFamily: 'proxima_novaSemibold', fontSize: '12px', letterSpacing: '.8px' }}
                  style={{ backgroundColor: 'white', borderRadius: '3px', ...buttonStyle }}
                  disabled={disableSelect || selected}
                  onClick={() => { this._handleSelect(plan) }}
                  fullWidth
                />
              }
            </div>
          </div>
          <div className={infoClassName}>
            {mainInfo && !!mainInfo.length &&
              mainInfo.map((info, i) => (
                <div key={info}>
                  <ListItem
                    leftIcon={<Icon name="tick-circle" style={{ width: '19px', height: '19px' }} />}
                    disabled
                    primaryText={
                      <div
                        className="planBenifitSubscriptionCard"
                        dangerouslySetInnerHTML={{ __html: info }}
                      />
                    }
                  />
                  {(i < mainInfo.length - 1) && <Divider />}
                </div>
              ))
            }

            {moreInfo && !!moreInfo.length &&
              <div className={'moreInfoSubscription'}>
                <ListItem
                  primaryText={<div className="showhideTextSubscriptionCard"><span>{accordionOpen ? 'HIDE FEATURES' : 'SEE ALL FEATURES'}</span></div>}
                  initiallyOpen={false}
                  open={accordionOpen}
                  autoGenerateNestedIndicator={false}
                  nestedListStyle={{ padding: 0 }}
                  onClick={() => { this.setState({ accordionOpen: !accordionOpen }) }}
                  nestedItems={moreInfo.map((info, i) => (
                    <ListItem key={info} style={{ margin: 0, padding: 0 }} disabled>
                      <ListItem
                        leftIcon={<Icon name="tick-circle" style={{ width: '19px', height: '19px' }} />}
                        primaryText={<div
                          className="planBenifitSubscriptionCard"
                          dangerouslySetInnerHTML={{
                            __html: info
                          }}
                        />
                        }
                        disabled
                      />
                      {(i < moreInfo.length - 1) && <Divider />}
                    </ListItem>
                  ))
                  }
                />
              </div>
            }
          </div>
        </div>
      </Paper>
    )
  }
}

SubscriptionCard.defaultProps = {
  description: '',
  termsModal: true,
  onSelected: () => { },
  header: '',
  mainInfo: [],
  moreInfo: [],
  style: {},
  detailStyle: {},
  infoClassName: '',
  title: '',
  subtext: '',
  buttonStyle: {},
  disableSelect: false,
  tax: 0,
  replaceAmount: false,
  replacementAmount: 0
}

SubscriptionCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  subtext: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  tax: PropTypes.number,
  buttonLabel: PropTypes.string.isRequired,
  plan: PropTypes.object.isRequired,
  frequency: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  termsModal: PropTypes.bool,
  onSelected: PropTypes.func,
  header: PropTypes.string,
  mainInfo: PropTypes.array,
  moreInfo: PropTypes.array,
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
  detailStyle: PropTypes.object,
  disableSelect: PropTypes.bool,
  infoClassName: PropTypes.string,
  replaceAmount: PropTypes.bool,
  replacementAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
