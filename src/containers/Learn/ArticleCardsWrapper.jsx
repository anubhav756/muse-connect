import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import ArticleCard from './ArticleCard';
import {
  getPosts as _getPosts
} from '../../redux/modules/learn';
import InfiniteScrollLoader from '../../components/InfiniteScrollLoader';
import { redirectToArticleDetails } from '../../libs/helpers/redirect';

class ArticleCardsWrapper extends Component {
  constructor(props) {
    super(props);
    this.loadMorePosts = this.loadMorePosts.bind(this);
  }
  componentWillMount() {
    const {
      getPosts,
      loadingCategories
    } = this.props;

    if (!loadingCategories)
      getPosts();
  }
  componentWillReceiveProps({ loadingCategories: nextLoadingCategories }) {
    const { loadingCategories, getPosts } = this.props;

    if (!nextLoadingCategories && loadingCategories)
      getPosts();
  }
  loadMorePosts() {
    const {
      posts: {
        isFetching,
      hasMore
      },
      loadingCategories,
      getPosts
    } = this.props;

    if (!hasMore || loadingCategories || isFetching)
      return;

    getPosts();
  }
  render() {
    const {
      loadingCategories,
      posts: {
        isFetching,
        displayList,
        hasMore
      }
    } = this.props;

    const postCards = displayList.map(post => (
      <div key={post.id} className="ArticleCardContainerLearn">
        <ArticleCard
          article={post}
          handleTouchTap={() => redirectToArticleDetails(post.slug)}
        />
      </div>)
    );

    return (
      <Row start="xs">
        <InfiniteScroll
          pageStart={0}
          loadMore={_.debounce(this.loadMorePosts, 500)}
          hasMore={hasMore}
          threshold={10}
          style={{ width: '100%' }}
        >
          {postCards}
        </InfiniteScroll>
        {
          (!postCards || !postCards.length) && !isFetching && !loadingCategories &&
          <div className="NoPostsLearn">No articles available here</div>
        }
        <Col xs={12}>
          <InfiniteScrollLoader
            loading={loadingCategories || isFetching}
            style={{ marginTop: 25, marginBottom: 25 }}
          />
        </Col>
      </Row>
    );
  }
}
ArticleCardsWrapper.propTypes = {
  posts: PropTypes.object.isRequired,
  loadingCategories: PropTypes.bool.isRequired,
  getPosts: PropTypes.func.isRequired
}

export default connect(
  ({
    learn: {
      posts,
    categories: {
        isFetching: loadingCategories
      }
    }
  }) => ({ posts, loadingCategories }), {
    getPosts: _getPosts
  }
)(ArticleCardsWrapper);
