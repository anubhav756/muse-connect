import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import moment from 'moment'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import {
  RaisedButton,
  CircularProgress,
  Paper
} from 'material-ui'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import { getPlansDetails, selectPlan } from '../../redux/modules/subscription'
import Loader from '../../components/Loader/ContentLoader'
import SubscriptionCard from '../../components/SubscriptionCard'
import './Subscription.scss'
import StripeModal from '../../components/StripeModal'
import ErrorMessage from '../../components/ErrorMessage'
import { TutorialCards, setTutorialCards } from '../../redux/modules/tutorialCard'
import endPoints from '../../routes/endPoints'
import { cleverTapSignupSuccess } from '../../libs/cleverTap'

const footerNoteStyle = {
  padding: 20,
  background: colors.lightestCyan
}

function updateDescDetailMaxHeight() {
  let maxHeight = 0;
  _.forEach(document.getElementsByClassName('descriptionDetailsSubscriptionCard'), ({ clientHeight }) => {
    if (clientHeight > maxHeight) maxHeight = clientHeight;
  });
  _.forEach(document.getElementsByClassName('descriptionDetailsSubscriptionCard'), (_o) => {
    const o = _o;
    if (o && o.style) {
      o.style.paddingBottom = o.style.paddingBottom || `${maxHeight - o.clientHeight}px`;
    }
  });
}

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

function fixCardHeight() {
  updateDescDetailMaxHeight()
  updateInfoSubMaxHeight()
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
    this.state = {
      enabledProceedButton: true
    }
  }

  componentWillMount() {
    this.props.getPlansDetails()
  }

  // call the action and selects the plan passed in store as selected plan
  _handleSelected(plan) {
    this.props.selectPlan(plan)
  }

  _disableProceedButton() {
    this.setState({ enabledProceedButton: false })
  }

  _enableProceedButton() {
    this.setState({ enabledProceedButton: true })
  }

  _handleStripeResponse(err) {
    if (err) {
      return this._enableProceedButton()
    }
    this.props.setTutorialCards(TutorialCards)
    cleverTapSignupSuccess() // clever tap event
    browserHistory.push(endPoints.dashboard)
  }

  _getPaymentButton(plan = {}, key) {
    const True = true
    const { enabledProceedButton } = this.state
    const { user } = this.props
    const activateTrialButton = plan && plan.replaceAmount
    return (
      <StripeModal
        user={user.info}
        title={plan.title}
        planID={plan.planID}
        promoID={plan.promoID}
        purID={plan.purID}
        trialDays={plan.trialDays}
        amount={plan.total}
        currency={plan.currency && plan.currency.toUpperCase()}
        checkoutURL={plan.checkoutURL}
        frequency={plan.frequency}
        stripeKey={key}
        disabled={_.isEmpty(plan) || !enabledProceedButton}
        callback={this._handleStripeResponse}
        button={
          <RaisedButton
            id={'SaveSubscriptionOnboard'}
            style={{ borderRadius: '10px', border: '0px', minWidth: '185px' }}
            buttonStyle={{ borderRadius: '10px', border: '0px' }}
            primary={True}
            label={enabledProceedButton ? activateTrialButton ? 'Activate Free Trial' : 'Proceed with Payment' : <CircularProgress size={30} color={colors.mediumGrey} innerStyle={{ verticalAlign: 'middle' }} />}
            labelStyle={{ letterSpacing: '.8px' }}
            onClick={() => { this._disableProceedButton() }}
          />
        }
      />
    )
  }

  _getPlanCards(plans = []) {
    const { plans: subscriptionPlans } = this.props
    const selectedPlan = subscriptionPlans.selectedPlan || {}
    const singlePlan = plans.length === 1
    const doublePlan = plans.length === 2
    return plans.map((plan = {}, i) => {
      const selected = plan.title === (selectedPlan && selectedPlan.title)
      return (
        <Col
          key={plan.planID + plan.promoID}
          mdOffset={singlePlan ? 4 : doublePlan ? i === 0 ? 1 : 2 : 0}
          smOffset={singlePlan ? 3 : 0}
          xs={12}
          sm={6}
          md={4}
        >
          <div style={{ padding: '10px 10px' }}>
            <SubscriptionCard
              header={plan.recommended === true ? plan.recommendedText || 'RECOMMENDED' : ''}
              ref={fixCardHeight}
              title={plan.title}
              price={plan.amount}
              frequency={plan.frequency}
              tax={plan.tax}
              description={plan.description}
              selected={selected}
              buttonLabel={selected ? 'SELECTED' : 'SELECT SUBSCRIPTION'}
              mainInfo={plan.defaultInfoHTML}
              moreInfo={plan.otherInfoHTML}
              termsModal={false}
              onSelected={this._handleSelected}
              plan={plan}
              style={{ boxShadow: 'none' }}
              detailStyle={{ backgroundColor: selected ? '' : colors.lightestGrey }}
              infoClassName="infoSubOnboard"
              buttonStyle={{ backgroundColor: selected ? 'white' : colors.lightestGrey }}
              replaceAmount={plan.replaceAmount}
              replacementAmount={plan.replacementAmount}
            />
          </div>
        </Col>
      )
    })
  }

  render() {
    const { plans } = this.props
    const { trialDays, trialAmount, trialCurrency, trialFrequency } = plans.info
    const startDate = new Date()
    const endDate = new Date().setDate(new Date().getDate() + trialDays)
    const showGreenBox = plans.selectedPlan && plans.selectedPlan.replaceAmount
    return (
      <div>
        {
          (plans.isError)
          ? <div style={{ paddingTop: '30px' }}>
            <ErrorMessage />
          </div>
          : (
            plans.isFetching ||
            (_.isEmpty(plans) || _.isEmpty(plans.info) || _.isEmpty(plans.info.plans))
          )
            ? <Loader zDepth={0} />
            : <div className={'containerSubscription'}>
              <div>
                <div style={{ padding: '0px 10px' }}>
                  <Row>
                    <Col xs={12} >
                      <div className="headingSubOnboard">
                        Subscription Plans
                      </div>
                      <div className="descriptionSubOnBoard">
                        Select the subscription plan that is right for you.
                        Our subscription plans have been designed to help you
                        get the most out of using Muse with your clients in your practice.
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <div style={{ marginTop: '20px' }}>
                    <Row>
                      { this._getPlanCards(plans.info && plans.info.plans) }
                    </Row>
                  </div>
                  <div style={{ padding: '0px 10px', marginTop: '30px' }} >
                    <div className="descriptionSubOnBoard">
                      {
                        showGreenBox && [
                          <Paper key={0} style={footerNoteStyle}>
                            If you activate your free trial, it will begin on {moment(startDate).format('MMMM D, YYYY')} and end on {moment(endDate).format('MMMM D, YYYY')}. Your credit card info is needed to activate your account, but <b>will not be charged during your trial period</b>. Once your trial period ends, you will be automatically charged ${trialAmount} {trialCurrency} {trialFrequency}.
                            <br />
                            <br />
                            *You can cancel your subscription at any time during your trial - please contact us at <a className="hyperLink" href="mailto:customercare@choosemuse.com">customercare@choosemuse.com</a> 5 business days prior to the end date of your trial period to cancel.
                          </Paper>,
                          <br key={1} />,
                          <br key={2} />
                        ]
                      }
                      <span>
                        The prices are in {plans.info.plans[0].currency.toUpperCase() === 'CAD' ? 'Canadian' : 'US' } dollars. Subscription plans are based on per professional and are non-refundable. Taxes where applicable will be applied during checkout.
                      </span>
                      <br />
                      <br />
                      <span>
                        When you select a plan,
                        it will renew automatically unless
                        you cancel in accordance with Muse Connect <a href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf" className="hyperLink" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '30px 10px 100px 10px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block' }} >
                      {
                        this._getPaymentButton(plans.selectedPlan, plans.info.key)
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
  getPlansDetails: PropTypes.func.isRequired,
  setTutorialCards: PropTypes.func.isRequired,
  selectPlan: PropTypes.func.isRequired
}

function mapStateToProps({ subscription, user }) {
  return { plans: subscription.plans, user }
}

export default connect(mapStateToProps,
  { getPlansDetails, selectPlan, setTutorialCards }
)(Subscription)
