import React from 'react';
import PropTypes from 'prop-types'
import {
  Paper
} from 'material-ui';
import { connect } from 'react-redux';
import ClientListItem from '../../components/ClientListItem';
import LearnImage from '../../components/LearnImage';

function ArticleCard({
  article: {
  title: {
      rendered: title
    },
  author: {
      name,
    description,
    avatar_urls: {
        48: profile
      }
    },
  featured_media: {
      source_url
    },
  categories
},
  allCategories,
  handleTouchTap
}) {
  const { name: categoryName, __categoryColor } = allCategories[categories[0]];
  return (
    <Paper
      onClick={handleTouchTap}
      style={{ background: 'white', position: 'relative', cursor: 'pointer' }}
    >
      <div className="ArticleContentContainerLearn">
        <div className="CardTitleLearn" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      <ClientListItem
        className="AuthorContainerLearn"
        heading={name}
        subHeading={description}
        user={{ firstName: name, profile }}
        avatarSize={40}
      />
      <div className="ArticleImageContainerLearn">
        <div className="ArticleColorStripLearn" style={{ background: __categoryColor }} />
        <div className="ArticleCategoryLabel" style={{ background: __categoryColor }}>
          {categoryName.toUpperCase()}
        </div>
        <LearnImage url={source_url} />
      </div>
    </Paper>
  );
}
ArticleCard.propTypes = {
  article: PropTypes.object.isRequired,
  handleTouchTap: PropTypes.func,
  allCategories: PropTypes.object.isRequired
}
ArticleCard.defaultProps = {
  handleTouchTap: () => { }
}

export default connect(({
  learn: {
    categories: {
      list: allCategories
    }
  }
}) => ({ allCategories })
)(ArticleCard);
