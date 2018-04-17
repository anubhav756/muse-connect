import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import PageTitle from '../../components/PageTitle'
import FAQsItemWrapper from './FAQsItemWrapper'
import './FAQsContent.scss'

export default class FAQsContent extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <PageTitle upperCase={false} text="FREQUENTLY ASKED QUESTIONS" />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FAQsItemWrapper />
          </Col>
        </Row>
      </div>
    )
  }
}
