import React from 'react'
import SubscriptionCardWrapper from './SubscriptionCardWrapper'

import './Plans.scss'

export default function Plans() {
  return (
    <div>
      {/* <div className="FormGroupHeaderAccount">
          Your Subcription Plan
        </div>
        <div className="subHeadingPlans">
          Your current subscription plan can be changed by choosing a plan below.
        </div>
        <Paper style={{ minHeight: '100px', backgroundColor: 'white' }}>
          <div className="containerYourPlanAccount">
            <div className="detailsYourPlanAccount">
              <div className="labelAccount">
                <span> Your current Plan </span>
              </div>
              <div className="labelValue">
                <span>Annual Plan</span>
              </div>
            </div>
            <div className="clearfix actionWrapPlanAccount">
              <FlatButton onClick={this.handleCancelSubscription}>
                <div>
                  <Icon
                    name="cancel"
                    className="actionIconPlanAccount"
                    style={{ verticalAlign: 'middle', color: colors.mediumGrey }}
                  />
                  <span className="actionTextPlanAccount">Cancel Your Plan</span>
                </div>
              </FlatButton>
            </div>
          </div>
        </Paper>
        <div className="FormGroupHeaderAccount">
        Available Subcription Plans
        </div>
      <div className="subHeadingPlans">
        Monthly and annual plans are available for you to choose below.
          Once you select a plan, please review the terms of service and submit payment information.
        </div>
      */}
      <div className="subscriptionWrapperPlans">
        <SubscriptionCardWrapper />
      </div>
    </div>
  )
}
