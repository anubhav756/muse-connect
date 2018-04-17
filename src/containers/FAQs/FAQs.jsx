import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import FAQsContent from './FAQsContent'

import './FAQs.scss'

export default class FAQ extends React.Component {
  render() {
    return (
      <Row>
        <Col className="containerFAQ" xs={12} >
          <FAQsContent />
        </Col>
      </Row>
    )
  }
}

