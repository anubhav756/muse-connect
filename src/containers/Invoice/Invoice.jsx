import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import {
  FlatButton
} from 'material-ui';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import { tabs } from '../Account/AccountContent';
import Icon from '../../components/Icon';
import PageTitle from '../../components/PageTitle';
import endPoints from '../../routes/endPoints';
import { capitalize, twoDecimalFormat } from '../../libs/helpers/common';

import './Invoice.scss';

class Invoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logosLoading: 2
    };

    this.printInvoice = this.printInvoice.bind(this);
    this.handleLogoLoad = this.handleLogoLoad.bind(this);

    // opens the page at top
    window.scrollTo(0, 0);
  }
  componentWillMount() {
    const { transactions, invoiceID } = this.props;

    if (_.findIndex(transactions, { invoiceID }) === -1)
      browserHistory.replace(`${endPoints.account.index}/${tabs[1].value}`);
  }
  componentDidMount() {
    const { print } = this.props;

    if (print)
      this.printInvoice();
  }
  printInvoice(e) {
    const { logosLoading } = this.state;

    if (e && e.preventDefault)
      e.preventDefault();

    if (logosLoading)
      this.setState({ waitingPrint: true });
    else
      window.print();
  }
  handleLogoLoad() {
    this.setState({
      logosLoading: this.state.logosLoading - 1
    }, () => {
      const { logosLoading, waitingPrint } = this.state;
      if (waitingPrint && !logosLoading)
        window.print();
    });
  }
  render() {
    const { transactions, invoiceID } = this.props;
    const invoiceIndex = _.findIndex(transactions, { invoiceID });
    const {
      businessName,
      country,
      displayName,
      invoiceStartDate,
      billingCycle,
      cardBrand,
      lastFour,
      plan,
      businessNumber,
      currency,
      amount,
      taxAmount,
      totalAmount,
      taxRate,
      taxType
    } = invoiceIndex > -1 ? transactions[invoiceIndex] : {};

    return (
      <div className="containerInvoice">
        <PageTitle
          className="noPrintInvoice"
          text="Billing"
          backLink={`${endPoints.account.index}/${tabs[1].value}`}
          rightIcon={[
            <FlatButton
              key="print_button"
              label="Print invoice"
              icon={<Icon name="print-icon" fill={colors.mediumGrey} style={{ height: 20, width: 20 }} />}
              onClick={this.printInvoice}
              disableTouchRipple
              hoverColor="transparent"
              labelStyle={{
                color: colors.mediumGrey,
                paddingTop: 2,
                fontWeight: 'bold',
                fontSize: 12,
                float: 'right'
              }}
              style={{ marginTop: 9 }}
            />
          ]}
        />
        <br className="noPrintInvoice" />
        <br className="noPrintInvoice" />
        <div className="headContainerInvoice">
          <div className="logoContainerInvoice">
            <img
              src="/images/logo/interaxon.png"
              height="45"
              alt="Interaxon"
              onLoad={this.handleLogoLoad}
            />
          </div>
          <div className="logoContainerInvoice">
            <img
              src="/images/logo/museConnect.png"
              height="32"
              alt="Muse Connect"
              onLoad={this.handleLogoLoad}
            />
          </div>
        </div>
        <br />
        <div>
          {'Interaxon Inc.'}<br />
          {'511 King Street West, Suite 303'}<br />
          {'Toronto, Ontario Canada, M5V 1K4'}<br />
          {`Business Number: ${businessNumber}`}<br />
          {'1-888-508-MUSE'}
        </div>
        <br className="noPrintInvoice" />
        <br />
        <strong>Subscription Invoice</strong>
        <div>
          This subscription invoice, effective as of the Start Date specified below, is entered into by the Subscriber named below and Interaxon Inc.
        </div>
        <br />
        <table className="tableInvoice">
          <thead>
            <tr className="tableHeaderInvoice">
              <th>Subscriber Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Business Name: {businessName}</td>
            </tr>
            <tr>
              <td>Country: {country}</td>
            </tr>
            <tr>
              <td>Contact: {displayName}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table className="tableInvoice">
          <thead>
            <tr>
              <th colSpan="2">Terms</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Invoice Number: {invoiceID}</td>
              <td>Start Date: {moment(invoiceStartDate).format('MMMM Do, YYYY')}</td>
            </tr>
            <tr>
              <td>Billing Cycle: {capitalize(billingCycle)}</td>
              <td>Billing Method: {cardBrand}  ****{lastFour}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table className="borderTableInvoice">
          <thead>
            <tr>
              <th colSpan="2">Order Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cellBorderTableInvoice">Subscription Plan: {plan}</td>
              <td className="cellBorderTableInvoice">
                <div className="amountContainerTableInvoice">
                  <div className="amountLabelTableInvoice">Subtotal:</div>
                  <div className="amountValueTableInvoice">${twoDecimalFormat(amount)} {currency}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td />
              <td className="cellBorderTableInvoice">
                <div className="amountContainerTableInvoice">
                  <div className="amountLabelTableInvoice">Taxes{taxAmount ? ` (${taxRate}% ${taxType})` : ''}:</div>
                  <div className="amountValueTableInvoice">${twoDecimalFormat(taxAmount)} {currency}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td />
              <td className="cellBorderTableInvoice">
                <div className="amountContainerTableInvoice">
                  <div className="amountLabelTableInvoice">Grand Total:</div>
                  <div className="amountValueTableInvoice">${twoDecimalFormat(totalAmount)} {currency}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div>
          Subscription plans are based on per professional and are non-refundable. When you select a plan, it will renew automatically unless you cancel in accordance with Muse Connect Terms of Service.  The terms and conditions specified in the Muse Connect Terms of Service shall be deemed to be incorporated by reference in this subscription invoice. Any inconsistent or additional terms from the Subscriber will be deemed to be rejected.
        </div>
        <br />
        <div>
          {'If you have any questions or concerns, please contact Customer Care at '}
          <Link className="linkInvoice" href="mailto:customercare@choosemuse.com">customercare@choosemuse.com</Link>
          {'.'}
        </div>
        <br className="noPrintInvoice" />
        <br className="noPrintInvoice" />
        <br className="noPrintInvoice" />
        <br className="noPrintInvoice" />
        <div className="printFooterInvoice">
          {`© ${moment().format('YYYY')} Interaxon Inc.`}
        </div>
      </div>
    );
  }
}
Invoice.propTypes = {
  print: PropTypes.string,
  transactions: PropTypes.array,
  invoiceID: PropTypes.string.isRequired
}
Invoice.defaultProps = {
  print: '',
  transactions: []
}

export default connect(
  ({
    account: {
      info: { transactions }
    },
    routing: {
      locationBeforeTransitions: {
        query: {
          print
        }
      }
    }
  }, {
    params: { id: invoiceID }
  }) => ({ print, transactions, invoiceID })
)(Invoice);
