import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import {
  Divider
} from 'material-ui';
import InfiniteScroll from 'react-infinite-scroller';
import StripeCheckout from 'react-stripe-checkout';
import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import InfiniteScrollLoader from '../../../components/InfiniteScrollLoader';
import NoResultFoundCard from '../../../components/NoResultFoundCard';
import { DESKTOP_VIEW } from '../../../libs/helpers/windowDimension';
import EditableLabel from '../../../components/EditableLabel';
// import { alert } from '../../../components/Modal';
import endPoints from '../../../routes/endPoints';
import {
  updatePaymentDetails as _updatePaymentDetails,
  getTransactions as _getTransactions
} from '../../../redux/modules/account';

import './Billing.scss';

// function handleCancelSubscription() {
//   alert(`By cancelling your existing plan, the cancellation will take\
//   effect at the end of your billing cycle on ${moment().format('MMMM D, YYYY')}.
//   Are you sure you want to cancel your plan?`)
//     .then(() => {
//       // yes to be handle here
//     })
//     .catch(() => {
//       // No to be handle here
//     })
// }

function handleInvoiceClick(id, print) {
  browserHistory.push(`${endPoints.invoice}/${id}${print ? '?print=true' : ''}`);
}

function polishPlan(subscription) {
  const {
  billingCycle,
    renewalDate,
    amount,
    currency,
    ...others
  } = subscription || {}

  return {
    billingCycle: billingCycle || '-',
    renewalDate: renewalDate ?
      moment(renewalDate).format('MMMM Do, YYYY') :
      '-',
    amount: amount || '-',
    currency: currency ? currency.toUpperCase() : '-',
    ...others
  }
}

class Billing extends Component {
  constructor() {
    super()

    this.renderBillingCycles = this.renderBillingCycles.bind(this)
  }

  componentWillMount() {
    const {
      account: {
        info
      },
      getTransactions
    } = this.props;

    if (!info || !info.length)
      getTransactions();
  }
  renderBillingCycles() {
    let { user: { info: { subscriptions } } } = this.props;
    if (Object.prototype.toString.call(subscriptions) === '[object Array]' && subscriptions.length === 1)
      subscriptions = subscriptions[0];

    if (Object.prototype.toString.call(subscriptions) !== '[object Array]') {
      const {
      billingCycle,
        renewalDate,
        amount,
        currency,
        inTrial,
    } = polishPlan(subscriptions);

      return (
        <EditableLabel
          className="editableBilling"
          labelOnly
          tabIndex="-1"
          title={['Billing Cycle', 'Renews On', 'Amount']}
          value={[
            _.capitalize(billingCycle),
            renewalDate,
            <span>
              {inTrial ? 'Trial' : `$${amount} ${currency}`}<br />
            </span>
          ]}
          // editLabel="Cancel your plan"
          // editClick={handleCancelSubscription}
          iconNames={['cancel']}
        />
      )
    }

    // ensure next plan at index 0, and old plan at index 1
    subscriptions = _.orderBy(subscriptions, o => new Date(o.startDate), 'desc')

    const {
    billingCycle: oldBillingCycle,
      amount: oldAmount,
      currency: oldCurrency,
      inTrial: oldInTrial,
      endDate: oldEndDate
  } = polishPlan(subscriptions[1]);
    const {
    billingCycle: newBillingCycle,
      amount: newAmount,
      currency: newCurrency,
      inTrial: newInTrial,
      startDate: newStartDate,
  } = polishPlan(subscriptions[0]);

    return [
      <EditableLabel
        key="old_plan"
        className="editableBilling"
        labelOnly
        tabIndex="-1"
        title={[
          'Billing Cycle (Current Plan)',
          'Ends On',
          'Amount'
        ]}
        value={[
          _.capitalize(oldBillingCycle),
          oldEndDate ? moment(oldEndDate).format('MMMM Do, YYYY') : '-',
          <span>
            {oldInTrial ? 'Trial' : `$${oldAmount} ${oldCurrency}`}<br />
          </span>
        ]}
        // editLabel="Cancel your plan"
        // editClick={handleCancelSubscription}
        iconNames={['cancel']}
      />,
      <EditableLabel
        key="new_plan"
        className="editableBilling"
        labelOnly
        tabIndex="-1"
        title={[
          'Billing Cycle (Next Plan)',
          'Starts On',
          'Amount'
        ]}
        value={[
          _.capitalize(newBillingCycle),
          newStartDate ? moment(newStartDate).format('MMMM Do, YYYY') : '-',
          <span>
            {newInTrial ? 'Trial' : `$${newAmount} ${newCurrency}`}<br />
          </span>
        ]}
        // editLabel="Cancel your plan"
        // editClick={handleCancelSubscription}
        iconNames={['cancel']}
      />
    ]
  }

  render() {
    const {
      user,
      wd,
      account: {
        info,
        isFetching,
        isError
      },
      getTransactions,
      updatePaymentDetails,
      stripeKey
    } = this.props;

    const transactions = info.transactions || [];

    return (
      <div>
        <div className="FormGroupHeaderAccount">
          Billing Information
        </div>
        <div className="FormGroupSubheaderAccount">
          Your billing cycle and payment information are found below.
          {
            !DESKTOP_VIEW(wd) &&
            <Divider
              style={{
                background: colors.lightestGrey,
                marginBottom: -30,
                marginTop: 30,
                marginLeft: -35,
                marginRight: -35
              }}
            />
          }
        </div>

        {stripeKey &&
          <StripeCheckout
            ref="stripeChange"
            name="Muse"
            image="https://www.choosemuse.com/wp-content/uploads/2014/10/muse_logo_noTag1.png"
            description="Change payment details"
            panelLabel="Update Card"
            email={user.info.email}
            allowRememberMe={false}
            amount={null}
            locale="auto"
            token={(token) => { updatePaymentDetails(token.id) }}
            stripeKey={stripeKey}
            triggerEvent="onClick"
            style={{ display: 'none' }}
          />
        }
        <EditableLabel
          labelOnly
          tabIndex="0"
          title="Credit Card"
          value={user.info.lastFour ? `**** ${user.info.lastFour}` : '-'}
          editClick={() => { this.refs.stripeChange.onClick() }}
          editLabel="Change payment details"
        />

        {this.renderBillingCycles()}
        <div className="cancelPlan">
          Plans are based on per professional and are non-refundable in accordance with Muse Connect <a href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf">Terms of Service</a>.<br />
          Contact <a href="mailto:customercare@choosemuse.com">customercare@choosemuse.com</a> to cancel your plan. It will take up to 5 business days to process this request.
        </div>

        <div className="FormGroupPaddingAccount" />

        <div className="FormGroupHeaderAccount">
          Invoices
        </div>
        <div className="FormGroupSubheaderAccount">
          You can view or print your invoices below.
          {
            !DESKTOP_VIEW(wd) &&
            <Divider
              style={{
                background: colors.lightestGrey,
                marginBottom: -30,
                marginTop: 30,
                marginLeft: -35,
                marginRight: -35
              }}
            />
          }
        </div>
        {
          !isFetching && (!transactions || !transactions.length) ?
            <NoResultFoundCard text="No invoices found" />
            :
            null
        }
        <InfiniteScroll
          pageStart={0}
          loadMore={_.debounce(getTransactions, 500)}
          hasMore={!isFetching && !isError && (!info || !!info.nextURL)}
          style={{ width: '100%' }}
        >
          {
            transactions.map(transaction => (
              <EditableLabel
                key={transaction.invoiceID}
                labelOnly
                tabIndex={transaction.invoiceID}
                title={
                  moment(transaction.invoiceStartDate).format('MMMM Do, YYYY')
                }
                value={`$${transaction.totalAmount} ${transaction.currency}`}
                editLabel={['View invoice', 'Print invoice']}
                editClick={[
                  () => handleInvoiceClick(transaction.invoiceID),
                  () => handleInvoiceClick(transaction.invoiceID, true)
                ]}
                iconNames={['icon-search', 'print-icon']}
                iconSizes={[15, 18]}
              />
            ))
          }
        </InfiniteScroll>
        <div className="FormGroupPaddingAccount" />
        <InfiniteScrollLoader loading={isFetching && !isError} style={{ margin: 30 }} />
      </div>
    )
  }
}
Billing.propTypes = {
  user: PropTypes.object.isRequired,
  wd: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  getTransactions: PropTypes.func.isRequired,
  updatePaymentDetails: PropTypes.func.isRequired
}

export default connect(
  ({ windowDimension: wd, account, user, subscription }) =>
    ({ wd, account, user, stripeKey: subscription.plansAccount.info.key }),
  ({
    getTransactions: _getTransactions,
    updatePaymentDetails: _updatePaymentDetails
  })
)(Billing);
