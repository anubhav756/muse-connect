import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Col, Grid } from 'react-flexbox-grid'

import Header from './Header'
import SideBar from './SideBar'
import './Professional.scss'
import { initWpAndLoadCategories } from '../../redux/modules/learn'
import { cleverTapLogin } from '../../libs/cleverTap'

export class Professional extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    };
    this.toggleSideBar = this.toggleSideBar.bind(this);
  }

  componentWillMount() {
    const { user } = this.props
    this.props.initWpAndLoadCategories()
    if (user && user.info) {
      const userDetails = user.info
      const planIds = []
      userDetails.subscriptions && userDetails.subscriptions.forEach((plan = {}) => {
        if (plan.planID) {
          return planIds.push(plan.planID)
        }
      })
      userDetails.planIds = planIds
      cleverTapLogin(userDetails)
    }
  }

  toggleSideBar() {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { children } = this.props
    return (
      <div className="ContainerProfessional">
        <Header toggleSideBar={this.toggleSideBar} />
        <SideBar open={this.state.open} toggleSideBar={this.toggleSideBar} />
        <div className="ContentContainerProfessional">
          <Grid fluid style={{ padding: 0 }}>
            <Col xs={12} >
              {
                children
              }
            </Col>
          </Grid>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

Professional.propTypes = {
  initWpAndLoadCategories: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { initWpAndLoadCategories })(Professional)
