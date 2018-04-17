import React from 'react'
import FAQsContent from '../../libs/constants/faqs'
import FAQsItem from './FAQsItem'
import './FAQsItemWrapper.scss'

function getFAQsItemContent(categoryContent = []) {
  const categoryItems = []
  categoryContent.forEach((detail) => {
    categoryItems.push(
      <div key={detail.question}>
        <FAQsItem
          question={detail.question}
          answer={detail.answer}
        />
      </div>
    )
  })
  return categoryItems
}

function getFAQsItems(details = []) {
  const sectionItems = []
  details.forEach((detail) => {
    const categoryName = Object.keys(detail)[0]
    sectionItems.push(
      <div key={categoryName}>
        <div className={'categoryFAQsItem'}>{categoryName}</div>
        <div style={{ padding: '10px 0px' }}>
          {this.getFAQsItemContent(detail[categoryName])}
        </div>
      </div>
    )
  })
  return sectionItems
}

export default class FAQsItemWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.getFAQsItems = getFAQsItems.bind(this)
    this.getFAQsItemContent = getFAQsItemContent.bind(this)
  }

  render() {
    return (
      <div className="containerFAQItemWrap">
        {this.getFAQsItems(FAQsContent)}
      </div>
    )
  }
}
