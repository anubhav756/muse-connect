import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
  Paper,
  CircularProgress
} from 'material-ui';
import { connect } from 'react-redux';
import ClientListItem from '../../components/ClientListItem';
import LearnImage from '../../components/LearnImage';
import { getLatestPost as _getLatestPost } from '../../redux/modules/learn';
import { redirectToArticleDetails } from '../../libs/helpers/redirect';


class MainArticleCard extends Component {
  componentWillMount() {
    const {
      loadingCategories,
      getLatestPost
    } = this.props;

    if (!loadingCategories)
      getLatestPost();
  }

  componentWillReceiveProps({ loadingCategories: nextLoadingCategories }) {
    const {
      loadingCategories,
      getLatestPost
    } = this.props;

    if (!nextLoadingCategories && loadingCategories)
      getLatestPost();
  }
  render() {
    const {
      latestPost: {
        info,
      isFetching
      },
      allCategories,
      loadingCategories
    } = this.props;

    if (loadingCategories || isFetching)
      return (
        <Paper style={{ background: 'white', position: 'relative' }}>
          <center style={{ height: 175, paddingTop: 125 }}><CircularProgress size={50} /></center>
        </Paper>
      );

    const { postDetails, authorDetails, featuredMedia: { source_url } } = info;
    const { name: categoryName, __categoryColor } = allCategories[postDetails.categories[0]];

    return (
      <Paper
        onClick={() => redirectToArticleDetails(postDetails.slug)}
        style={{ background: 'white', position: 'relative', cursor: 'pointer' }}
      >
        <div className="MainArticleContentContainerLearn">
          <div
            onClick={() => redirectToArticleDetails(postDetails.slug)}
            className="MainCardTitleLearn"
            dangerouslySetInnerHTML={{ __html: postDetails.title.rendered }}
          />
          <div
            className="MainCardSubTitleLearn"
            dangerouslySetInnerHTML={{ __html: postDetails.excerpt.rendered }}
          />
        </div>
        <ClientListItem
          className="MainAuthorContainerLearn"
          heading={authorDetails.name}
          subHeading={authorDetails.details}
          user={{ firstName: authorDetails.name, profile: authorDetails.avatar_urls[48] }}
          avatarSize={40}
        />
        <div className="MainArticleImageContainerLearn">
          <div className="MainArticleCategoryLabel" style={{ background: __categoryColor }}>{categoryName.toUpperCase()}</div>
          <LearnImage url={source_url} />
        </div>
      </Paper>
    );
  }
}
MainArticleCard.propTypes = {
  latestPost: PropTypes.object.isRequired,
  getLatestPost: PropTypes.func.isRequired,
  allCategories: PropTypes.object.isRequired,
  loadingCategories: PropTypes.bool.isRequired
}

export default connect(({
  learn: {
    latestPost,
  categories: {
    list: allCategories,
    isFetching: loadingCategories
  }
  }
}) => ({ latestPost, allCategories, loadingCategories }),
  { getLatestPost: _getLatestPost }
)(MainArticleCard);
