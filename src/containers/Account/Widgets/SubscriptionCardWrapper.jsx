import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import _ from 'lodash'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import CircularProgress from 'material-ui/CircularProgress';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss'
import { getPlansDetailsAccount, enrollPlan } from '../../../redux/modules/subscription'
import Loader from '../../../components/Loader/ContentLoader'
import SubscriptionCard from '../../../components/SubscriptionCard'
import './SubscriptionCardWrapper.scss'
import StripeModal from '../../../components/StripeModal'
import ErrorMessage from '../../../components/ErrorMessage'
import Modal from '../../../components/Modal'
import { cleverTapChangePlan } from '../../../libs/cleverTap'

function updateInfoSubMaxHeight() {
  let maxHeight = 0;
  _.forEach(document.getElementsByClassName('infoSubOnboard'), ({ clientHeight }) => {
    if (clientHeight > maxHeight) maxHeight = clientHeight;
  });
  _.forEach(document.getElementsByClassName('infoSubOnboard'), (_o) => {
    const o = _o;
    if (o && o.lastChild && o.lastChild.style && (o.lastChild.className === 'moreInfoSubscription')) {
      o.lastChild.style.paddingTop = o.lastChild.style.paddingTop || `${maxHeight - o.clientHeight}px`;
    }
  });
}

function shouldProceedPaymentVisible(plans) {
  const _plans = _.filter(plans, { upcomingPlan: false, currentPlan: false })
  return !!_plans.length
}
export class Subscription extends React.Component {

  constructor(props) {
    super(props)
    this._getPlanCards = this._getPlanCards.bind(this)
    this._handleSelected = this._handleSelected.bind(this)
    this._getPaymentButton = this._getPaymentButton.bind(this)
    this._enableProceedButton = this._enableProceedButton.bind(this)
    this._disableProceedButton = this._disableProceedButton.bind(this)
    this._handleStripeResponse = this._handleStripeResponse.bind(this)
    this._handleTermsCheck = this._handleTermsCheck.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
    this._getStripeModalPaymentButton = this._getStripeModalPaymentButton.bind(this)
    this.state = {
      modalOpen: false,
      termsAccepted: false,
      enabledProceedButton: true,
      selected: null
    }
  }

  componentWillMount() {
    this.props.getPlansDetailsAccount()
    const { plans } = this.props
    if (!_.isEmpty(plans.enrolledPlan)) {
      this._handleSelected(plans.enrolledPlan)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { plans } = this.props
    if (plans.enrolledPlan !== (nextProps.plans && nextProps.plans.enrolledPlan)) {
      this._handleSelected(nextProps.plans.enrolledPlan)
    }
  }

  _toggleModal() {
    const { modalOpen } = this.state
    this.setState({ modalOpen: !modalOpen, termsAccepted: false })
  }

  // set the selected plan in component state
  _handleSelected(plan) {
    this.setState({ selected: plan })
  }

  _handleTermsCheck(event, checked) {
    this.setState({ termsAccepted: checked })
  }

  _disableProceedButton() {
    this.setState({ enabledProceedButton: false })
  }

  _enableProceedButton() {
    this.setState({ enabledProceedButton: true })
  }

  _handleStripeResponse(err, token) {
    if (err) {
      this.setState({ modalOpen: false, termsAccepted: false })
      return this._enableProceedButton()
    }
    cleverTapChangePlan() // clever tap event
    this.props.enrollPlan(this.state.selected)
    this.setState({ modalOpen: false, termsAccepted: false })
    this._enableProceedButton()
  }

  _getPaymentButton(plan = {}, enrolledPlan = {}) {
    const True = true
    const { enabledProceedButton, modalOpen } = this.state
    return (
      <RaisedButton
        id={'SaveSubscriptionOnboard'}
        style={{ borderRadius: '10px', border: '0px', minWidth: '185px' }}
        buttonStyle={{ borderRadius: '10px', border: '0px' }}
        primary={True}
        disabled={_.isEmpty(plan) || ((plan && plan.title) === (enrolledPlan && enrolledPlan.title)) || !enabledProceedButton || modalOpen}
        label={'Proceed with Payment'}
        labelStyle={{ letterSpacing: '.8px' }}
        onClick={() => { this._toggleModal() }}
      />
    )
  }

  _getStripeModalPaymentButton(plan = {}, key = '') {
    const True = true
    const { termsAccepted, enabledProceedButton } = this.state
    const { user } = this.props
    return (
      <StripeModal
        user={user.info}
        planID={plan && plan.planID}
        title={plan && plan.title}
        amount={plan && plan.total}
        trialDays={plan && plan.trialDays}
        currency={plan && plan.currency && plan.currency.toUpperCase()}
        checkoutURL={plan && plan.checkoutURL}
        frequency={plan && plan.frequency}
        stripeKey={key}
        disabled={!termsAccepted || !enabledProceedButton}
        callback={this._handleStripeResponse}
        button={
          <RaisedButton
            id={'SaveSubscriptionOnboard'}
            style={{ borderRadius: '10px', border: '0px', minWidth: '185px' }}
            buttonStyle={{ borderRadius: '10px', border: '0px' }}
            primary={True}
            label={enabledProceedButton ? 'Proceed to Payment' : <CircularProgress size={30} color={colors.mediumGrey} innerStyle={{ verticalAlign: 'middle' }} />}
            labelStyle={{ letterSpacing: '.8px' }}
            onClick={() => { this._disableProceedButton() }}
          />
        }
      />
    )
  }

  _getPlanCards(plans = []) {
    const { selected: selectedPlan } = this.state
    const singlePlan = plans.length === 1
    return plans.map((plan = {}) => {
      const selected = (plan && plan.title) === (selectedPlan && selectedPlan.title)
      const enrolled = plan && plan.currentPlan
      const isNext = plan && plan.upcomingPlan
      return (<Col key={plan.planID} smOffset={singlePlan ? 3 : 0} xs={12} sm={6} md={6}>
        <div style={{ padding: '10px 0px' }}>
          <SubscriptionCard
            ref={updateInfoSubMaxHeight}
            header={enrolled ? 'CURRENT PLAN' : isNext ? 'NEXT PLAN' : ''}
            title={plan.title}
            frequency={plan.frequency}
            price={plan.amount}
            tax={plan.tax}
            selected={selected}
            buttonLabel={selected ? 'SELECTED' : 'SELECT SUBSCRIPTION'}
            mainInfo={plan.defaultInfoHTML}
            moreInfo={plan.otherInfoHTML}
            termsModal={false}
            onSelected={(value) => { if (!enrolled) { this._handleSelected(value) } }}
            plan={plan}
            style={{ boxShadow: 'none' }}
            disableSelect={enrolled || isNext}
            detailStyle={{ backgroundColor: selected ? '' : colors.lightestGrey }}
            infoClassName="infoSubOnboard"
            buttonStyle={{ backgroundColor: selected ? 'white' : colors.lightestGrey }}
          />
        </div>
      </Col>)
    })
  }

  render() {
    const { plans } = this.props
    const { modalOpen } = this.state
    return (
      <div>
        {
          (plans.isError)
            ? <div style={{ paddingTop: '30px' }}>
              <ErrorMessage />
            </div>
            : (plans.isFetching || (_.isEmpty(plans) || _.isEmpty(plans.info) || _.isEmpty(plans.info.plans)))
              ? <Loader zDepth={0} />
              : <div className={'containerSubscriptionAccount'}>
                <div>
                  <Modal
                    toggleModal={this._toggleModal}
                    title={'Terms of Service'}
                    open={modalOpen}
                    autoScrollBodyContent={false}
                    titleStyle={{ fontFamily: 'proxima_novaLight', fontWeight: '600', letterSpacing: '0.8px', paddingLeft: '20px' }}
                    style={{ maxWidth: '440px' }}
                    childrenStyle={{ paddingLeft: '20px', paddingRight: '20px', overflowY: 'auto', marginRight: '0px' }}
                    iconName="x-grey-icon"
                  >
                    <div style={{ fontSize: '14px', color: colors.mediumGrey, fontFamily: 'proxima_novamedium' }}>
                      <div>
                        Before proceeding, you must accept the
                        <a href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf" className="hyperLink" target="_blank"> Terms of Service</a>.
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <Checkbox
                            label={<span>I have read and accepted to the Muse Connect <a href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf" className="hyperLink" target="_blank">Terms of Service</a>.</span>}
                            labelStyle={{ lineHeight: '18px' }}
                            iconStyle={{ fill: colors.lightGrey }}
                            onCheck={this._handleTermsCheck}
                            inputStyle={{ width: '24px' }}
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }} className="clearfix">
                        <div style={{ display: 'inline-block', float: 'right' }}>
                          {this._getStripeModalPaymentButton(this.state.selected, plans.info.plans && plans.info.key)}
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <div style={{ padding: '0px' }}>
                    <Row>
                      <Col xs={12} >
                        <div className="FormGroupHeaderAccount">
                          Available Subscription Plans
                      </div>
                        <div className="descriptionSubOnBoard">
                          Monthly and annual plans are available for you to choose
                          below. Once you select a plan, please review the terms of
                          service and submit payment information. If you choose to subscribe to another plan,
                          this next plan will only take effect after the current plan ends.
                      </div>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <div style={{ marginTop: '20px' }}>
                      <Row>
                        {this._getPlanCards(plans.info && plans.info.plans)}
                      </Row>
                    </div>
                    <div style={{ padding: '0px 10px', marginTop: '30px' }} >
                      <div className="descriptionSubOnBoard">
                        <span>
                          The prices are in {plans.info.plans[0].currency.toUpperCase() === 'CAD' ? 'Canadian' : 'US'} dollars. Subscription plans are based on per professional and are non-refundable. Taxes where applicable will be applied during checkout.
                      </span>
                        <br />
                        <br />
                        <span>
                          When you select a plan,
                        it will renew automatically unless
                        you cancel in accordance with Muse Connect <a href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf" className="hyperLink" target="_blank">Terms of Service</a>.
                      </span>
                      </div>
                    </div>
                    <div style={{ padding: '30px 10px 100px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-block' }} >
                        {
                          shouldProceedPaymentVisible(plans.info.plans) &&
                          this._getPaymentButton(this.state.selected, plans.enrolledPlan, plans.info.plans && plans.info.key)
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        }
      </div>
    )
  }
}

Subscription.propTypes = {
  plans: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getPlansDetailsAccount: PropTypes.func.isRequired,
  enrollPlan: PropTypes.func.isRequired
}

function mapStateToProps({ subscription, user }) {
  return { plans: subscription.plansAccount, user }
}

export default connect(mapStateToProps,
  { getPlansDetailsAccount, enrollPlan }
)(Subscription)
