import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import should from 'should'
import { Paper, CircularProgress } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles'
import LearnComponent, { MainArticleCard, ArticleCardsWrapper } from '../../../src/containers/Learn'
import { ALL } from '../../../src/libs/helpers/learn'
import { PostsCategory, PostsFilter } from '../../../src/components/SelectDropDown'
import PageTitle from '../../../src/components/PageTitle'


const getContext = store => ({
  store,
  muiTheme: getMuiTheme(),
})

const categoriesList = {
  1: {
    id: 18,
    count: 0,
    description: '',
    link: 'https:\/\/museconnectblog.choosemuse.com\/category\/article\/',
    name: 'article',
    slug: 'article',
    taxonomy: 'category',
    parent: 0,
    meta: [
    ],
    _links: {
      self: [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/categories\/18'
        }
      ],
      collection: [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/categories'
        }
      ],
      about: [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/taxonomies\/category'
        }
      ],
      'wp:post_type': [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/posts?categories=18'
        }
      ],
      curies: [
        {
          name: 'wp',
          href: 'https:\/\/api.w.org\/{rel}',
          templated: true
        }
      ]
    }
  },
  2: {
    id: 21,
    count: 5,
    description: '',
    link: 'https:\/\/museconnectblog.choosemuse.com\/category\/case-study\/',
    name: 'case study',
    slug: 'case-study',
    taxonomy: 'category',
    parent: 0,
    meta: [
    ],
    _links: {
      self: [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/categories\/21'
        }
      ],
      collection: [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/categories'
        }
      ],
      about: [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/taxonomies\/category'
        }
      ],
      'wp:post_type': [
        {
          href: 'https:\/\/museconnectblog.choosemuse.com\/wp-json\/wp\/v2\/posts?categories=21'
        }
      ],
      curies: [
        {
          name: 'wp',
          href: 'https:\/\/api.w.org\/{rel}',
          templated: true
        }
      ]
    }
  }
}
const categoryInitialState = {
  isFetching: true,
  list: categoriesList
}
// stores initial state for latest post/article,
const lpInitialState = {
  isFetching: true,
  info: {
    authorDetails: {
      name: 'Muse Team',
      slug: 'anju',
      description: '',
      avatar_urls: {
        24: 'http://2.gravatar.com/avatar/eab88c55c24aeddb2436f212543eded4?s=24&d=mm&r=g',
        48: 'http://2.gravatar.com/avatar/eab88c55c24aeddb2436f212543eded4?s=48&d=mm&r=g'
      }
    },
    featuredMedia: {
      source_url: 'https://museconnectblog.choosemuse.com/wp-content/uploads/2017/07/Screen-Shot-2017-07-27-at-4.28.34-PM.png'
    },
    postDetails: {
      slug: 'muse-professionals-handbook',
      title: {
        rendered: 'Professional&#8217;s Handbook'
      },
      categories: [1],
      excerpt: {
        rendered: 'dummy text'
      }
    }
  }
}

// stores initial state for posts,
const postsInitialState = {
  isFetching: true,
  info: [],
  totalPosts: 0,
  displayList: [],
  continuousPostsUpto: 0,
  category: ALL,
  filter: ALL,
  hasMore: true
}

// stores initial state for current/selected/active post
const cpInitialState = {
  isFetching: false, // true
  info: {}
}

const storeState = {
//   user,
//   windowDimension: {
//     innerWidth: 1150
//   },
  learn : {
    categories: categoryInitialState,
    latestPost: lpInitialState,
    posts: postsInitialState,
    currentPost: cpInitialState,
    authors: {},
    featuredMedias: {},
    wpObject: {},
    isError: false
  }
}
const store = {
  getState: () => ({
    ...storeState
  }),
  subscribe: () => {},
  dispatch: () => {}
}

describe('(Container) Learn', () => {
  let contextRef = getContext(store)

  beforeAll(() => {
    contextRef = getContext(store)
  })

  const buildWrapper = () => (
    mount(<LearnComponent />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
        store: PropTypes.object
      }
    })
  )

  describe('', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('should exist', () => {
      wrapper.should.have.length(1)
    })
    it('should render Page title component', () => {
      wrapper.find(PageTitle).should.have.length(1)
    })
    it('should render Main Article Card component', () => {
      wrapper.find(MainArticleCard).should.have.length(1)
    })
    it('should render Posts Category component', () => {
      wrapper.find(PostsCategory).should.have.length(1)
    })
    it('should render Posts Filter component', () => {
      wrapper.find(PostsFilter).should.have.length(1)
    })
    it('should render Article Cards Wrapper compoent', () => {
      wrapper.find(ArticleCardsWrapper).should.have.length(1)
    })
  })

  describe('Main Article Card', () => {
    let wrapper = null
    beforeAll(() => {
      wrapper = buildWrapper()
    })
    it('Should show loader if categories are loading or latest post is fetching', () => {
      wrapper.find(MainArticleCard).find(CircularProgress).should.have.length(1)
    })

    describe('after details has fetched', () => {
      beforeAll(() => {
        storeState.learn.categories.isFetching = false
        storeState.learn.latestPost.isFetching = false
        wrapper = buildWrapper()
      })
      it('should render Content for main article card', () => {
        wrapper.find(MainArticleCard).find('.MainArticleContentContainerLearn').should.have.length(1)
      })
      it('should call redirectToArticleDetails onClick of paper', () => {
        wrapper.find(MainArticleCard).find(Paper).getElement().props.onClick()
      })
    })
  })
})
