import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import {
  Paper,
  Divider,
  RaisedButton
} from 'material-ui';

import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss';
import Loader from '../../../components/Loader/ContentLoader'
import NoResultFound from '../../../components/NoResultFoundCard'
import ListItem from '../../../components/ClientListItem'
import LearnImage from '../../../components/LearnImage';
import { getLatestPost } from '../../../redux/modules/learn'
import { redirectToArticleDetails } from '../../../libs/helpers/redirect'

import './Style.scss'

function getLabel(categories = {}, postDetails = {}) {
  const categoryList = categories.list
  const latestPostCategory = postDetails.categories && postDetails.categories[0]
  return categoryList[latestPostCategory] && categoryList[latestPostCategory].slug
}

function handleTouchTap(postDetails = {}) {
  redirectToArticleDetails(postDetails.slug)
}

export class Learn extends React.Component {
  constructor(props) {
    super(props)
    this.handleTouchTap = handleTouchTap.bind(this)
  }

  componentWillMount() {
    const { categories } = this.props.learn
    if (!categories.isFetching) {
      this.props.getLatestPost()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { categories } = this.props.learn
    if (categories.isFetching && !nextProps.learn.categories.isFetching) {
      this.props.getLatestPost()
    }
  }

  render() {
    const { categories, latestPost, isError } = this.props.learn
    const { featuredMedia, postDetails, authorDetails } = latestPost.info
    return (
      <Paper rounded={false} style={{ backgroundColor: 'white', height: '431px' }}>
        {
          isError
          ? <NoResultFound style={{ paddingTop: '200px' }} text={'Something went wrong while fetching details...'} zDepth={0} />
          : categories.isFetching || latestPost.isFetching
          ? <Loader zDepth={0} style={{ paddingTop: '200px' }} />
          : <div style={{ position: 'relative' }}>
            <LearnImage
              onClick={() => { this.handleTouchTap(postDetails) }}
              url={featuredMedia && featuredMedia.source_url}
              style={{ height: '250px' }}
            />
            <Divider style={{ backgroundColor: colors.cyan, height: '5px', marginTop: '-5px' }} />
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
              <RaisedButton
                label={getLabel(categories, postDetails)}
                backgroundColor={colors.cyan}
                labelColor={colors.cyan}
                style={{ borderRadius: '30px', minWidth: '60px', boxShadow: 'none' }}
                buttonStyle={{ borderRadius: '30px', height: '25px', lineHeight: '25px' }}
                labelStyle={{ color: colors.white, fontSize: '10px', letterSpacing: '1px' }}
              />
            </div>
            <div style={{ padding: '30px' }}>
              <span
                onClick={() => this.handleTouchTap(postDetails)}
                style={{ fontFamily: 'proxima_novasemibold', fontSize: '18px', cursor: 'pointer' }}
                dangerouslySetInnerHTML={{ __html: postDetails.title && postDetails.title.rendered }}
              />
              <div style={{ paddingTop: '40px' }}>
                <ListItem
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
            </div>
          </div>
        }
      </Paper>
    )
  }
}

function mapStateToProps({ learn }) {
  return { learn }
}

export default connect(mapStateToProps, { getLatestPost })(Learn)

Learn.propTypes = {
  learn: PropTypes.object.isRequired,
  getLatestPost: PropTypes.func.isRequired
}

