import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import Icon from '../../components/Icon'
import PageTitle from '../../components/PageTitle'
import ListItem from '../../components/ClientListItem'
import { getCurrentPostBySlug } from '../../redux/modules/learn'
import Loader from '../../components/Loader/ContentLoader'
import NoResultFound from '../../components/NoResultFoundCard'
import endPoints from '../../routes/endPoints';
import LearnImage from '../../components/LearnImage'

import './ArticleDetailsContent.scss'
import './ArticleDetails.scss'

export class ArticleDetails extends React.Component {

  componentWillMount() {
    const { categories } = this.props.learn
    if (!categories.isFetching) {
      const { router } = this.context
      const _endPoints = router.location && router.location.pathname && router.location.pathname.split('/')
      this.props.getCurrentPostBySlug(_endPoints[2])
    }
  }

  componentWillReceiveProps(nextProps) {
    const { categories } = this.props.learn
    if (categories.isFetching && !nextProps.learn.categories.isFetching) {
      const { router } = this.context
      const _endPoints = router.location && router.location.pathname && router.location.pathname.split('/')
      this.props.getCurrentPostBySlug(_endPoints[2])
    }
  }

  render() {
    const { categories, currentPost: { isFetching, info }, isError } = this.props.learn
    if (isError) {
      return (
        <div>
          <NoResultFound text={'Something went wrong while loading details...'} style={{ marginTop: '20px' }} />
        </div>
      )
    }
    if (isFetching || categories.isFetching) {
      return (
        <Loader style={{ marginTop: '20px' }} />
      )
    }
    const { postDetails, featuredMedia, authorDetails } = info
    let category = {}
    if (postDetails && postDetails.categories && postDetails.categories.length) {
      category = categories.list[postDetails.categories[0]] || {}
    }
    return (
      <div>
        <Row>
          <Col xs={12} >
            <PageTitle
              text="Muse Learn"
              backLink={endPoints.learn}
              offset={20}
              rightIcon={[
                <FlatButton
                  key="title_right"
                  label={<span><Icon style={{ verticalAlign: 'middle', color: '#d8d8d8' }} name="print-icon" /><span className={'printArticle'} >Print</span></span>}
                  labelStyle={{ textTransform: 'none', color: 'rgba(0, 0, 0, 0.4)' }}
                  onClick={() => { window.print() }}
                />
              ]}
              className="pageTitleArticleDetails"
            />
          </Col>
        </Row>
        <span className="printableContainer">
          <Row center={'xs'}>
            <Col xs={12} sm={7}>
              <div
                className="titleArticleDetails"
                dangerouslySetInnerHTML={{
                  __html: postDetails && postDetails.title && postDetails.title.rendered
                }}
              />
            </Col>
          </Row>
          <Row center={'xs'}>
            <Col xs={12} sm={8}>
              <div className="featuredImageArticleDetails" >
                <div className="categoryLabelArticleDetails" style={{ background: category.__categoryColor }}>{category.name && category.name.toUpperCase()}</div>
                <div className="imageContainerLearnArticleDetails">
                  <LearnImage url={(featuredMedia && featuredMedia.source_url) || '/images/learnDefault.jpg'} />
                </div>
              </div>
            </Col>
          </Row>
          <Row center={'xs'}>
            <Col xs={12} >
              <div className="authorDetailsArticleDetails">
                <ListItem
                  listItemStyle={{ textAlign: 'left' }}
                  user={{
                    firstName: authorDetails && authorDetails.name,
                    profile: authorDetails &&
                    authorDetails.avatar_urls &&
                    authorDetails.avatar_urls[48]
                  }}
                  heading={authorDetails && authorDetails.name}
                  subHeading={authorDetails && authorDetails.description}
                />
              </div>
            </Col>
          </Row>
          <Row center={'xs'}>
            <Col xs={12} sm={8}>
              <div className={'articleContent'} style={{ textAlign: 'left' }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: postDetails && postDetails.content && postDetails.content.rendered
                  }}
                />
              </div>
            </Col>
          </Row>
        </span>
      </div>
    )
  }
}

function mapStateToProps({ learn }) {
  return { learn }
}

export default connect(mapStateToProps, { getCurrentPostBySlug })(ArticleDetails)

ArticleDetails.contextTypes = {
  router: PropTypes.object.isRequired
}

ArticleDetails.propTypes = {
  learn: PropTypes.object.isRequired,
  getCurrentPostBySlug: PropTypes.func.isRequired
}
