import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import { Row, Col } from 'react-flexbox-grid';

import Modal from '../../components/Modal';
import Icon from '../../components/Icon';
import {
  qualifyingDegrees,
  qualifyingProfessions,
  licensesAndCertifications
} from '../../libs/constants/profession';

export default class CertificationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openList: -1
    }
    this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
    this.renderNestedList = this.renderNestedList.bind(this);
  }

  handleNestedListToggle(index) {
    this.setState({
      openList: this.state.openList === index ? -1 : index
    });
  }

  renderNestedList(items) {
    return (
      <List>
        {
          items.map(({ primaryText, secondaryText, content }, index) => (
            <div key={primaryText}>
              <Divider />
              <ListItem
                innerDivStyle={{
                  paddingLeft: 0,
                  paddingRight: 0
                }}
                primaryText={
                  <div
                    style={{
                      fontSize: '14px',
                      fontFamily: 'proxima_novasemibold',
                      color: styleVariables.darkGrey
                    }}
                  >
                    {primaryText}
                  </div>
                }
                secondaryText={
                  <div
                    style={{
                      fontSize: '12px',
                      color: styleVariables.mediumGrey
                    }}
                  >
                    {secondaryText}
                  </div>
                }
                rightIcon={<Icon name={this.state.openList !== index ? 'add-icon' : 'subtract-icon'} fill={styleVariables.black} style={{ width: 15, height: 15 }} />}
                primaryTogglesNestedList
                open={this.state.openList === index}
                onNestedListToggle={() => this.handleNestedListToggle(index)}
                nestedItems={[
                  <ListItem
                    key="modal"
                    disabled
                    style={{
                      margin: '0px',
                      paddingTop: '0px'
                    }}
                    innerDivStyle={{
                      padding: 0
                    }}
                  >
                    {content}
                  </ListItem>
                ]}
              />
            </div>
          ))
        }
        <Divider />
      </List>
    );
  }

  render() {
    const qualifyingProfessionsList = [[], []];
    const qualifyingDegreesList = [];
    const licensesAndCertificationsList = [];

    for (let i = 0; i < qualifyingProfessions.length; i += 1)
      if (i < qualifyingProfessions.length / 2)
        qualifyingProfessionsList[0].push(
          <span key={qualifyingProfessions[i]}>{qualifyingProfessions[i]}<br /></span>
        );
      else
        qualifyingProfessionsList[1].push(
          <span key={qualifyingProfessions[i]}>{qualifyingProfessions[i]}<br /></span>
        );

    _.forEach(qualifyingDegrees, (degree, abbr) => qualifyingDegreesList.push(
      <tr key={abbr}><td><span className="hyperLink">{abbr}</span></td><td>{degree}</td></tr>
    ));

    _.forEach(licensesAndCertifications, (license, abbr) => licensesAndCertificationsList.push(
      <tr key={abbr}><td><span className="hyperLink">{abbr}</span></td><td>{license}</td></tr>
    ));

    return (
      <Modal
        title="Eligibility Requirements"
        open={this.props.showModal}
        toggleModal={this.props.toggleModal}
        contentClassName="certificationModal"
      >
        <div className="description">
          <br />
          Muse Connect is available to qualified professionals only.
          </div>
        <div className="helperText">
          A professional is qualified if they hold any
            of the following (“Qualifying Credentials”):
            <br />
          <br />
          The professional is engaged in a Qualifying Profession
            <br />
          The professional holds a Qualifying Degree
            <br />
          The professional holds a Qualifying License or Certification<br /><br />
          We are always updating our list of qualifying credentials.
            If you believe you qualify but your specific credential is not listed below,
            please contact professionals@choosemuse.com for an individual assessment.
            <br />
          <br />
          All accounts are reviewed. Accounts registered by
            non-qualified professionals will be suspended without notice.
          </div>
        <br />
        {
          this.renderNestedList([
            {
              primaryText: 'Qualifying Professions',
              secondaryText: 'View all qualifying professions',
              content: <div className="helperText">
                <Row>
                  <Col xs={12} sm={6}>
                    {qualifyingProfessionsList[0]}
                  </Col>
                  <Col xs={12} sm={6}>
                    {qualifyingProfessionsList[1]}
                  </Col>
                </Row>
              </div>
            },
            {
              primaryText: 'Qualifying Degrees',
              secondaryText: 'View all qualifying degrees listed here',
              content: <div className="helperText">
                <table>
                  <tbody>
                    {qualifyingDegreesList}
                  </tbody>
                </table>
              </div>
            },
            {
              primaryText: 'Licenses and Certifications',
              secondaryText: 'View all licenses and certifications listed here',
              content: <div className="helperText">
                <table>
                  <tbody>
                    {licensesAndCertificationsList}
                  </tbody>
                </table>
              </div>
            }
          ])
        }
      </Modal>
    )
  }
}

CertificationModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
}
