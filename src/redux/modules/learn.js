// imports
import _ from 'lodash'
import { notify } from './notice'
import {
  initialiseWpObject,
  getCategories,
  fetchMediaById,
  fetchAuthorById,
  fetchPostBySlug,
  fetchPostsApi,
  fetchLatestPostsApi,
  applyFilter,
  applyCategory,
  mergePosts,
  getSinglePostDetailObj,
  ALL
} from '../../libs/helpers/learn'

// ------------------------------------
// Constants
// ------------------------------------
export const LCATEGORY_FETCH_START = 'LCATEGORY_FETCH_START'
export const LEARN_ERROR = 'LEARN_ERROR'
export const LCATEGORY_FETCH_END = 'LCATEGORY_FETCH_END'
export const LPOST_FETCH_START = 'LPOST_FETCH_START'
export const LPOST_ERROR = 'LPOST_ERROR'
export const LPOST_FETCH_END = 'LPOST_FETCH_END'
export const POSTS_FETCH_START = 'POSTS_FETCH_START'
export const POSTS_FETCH_END = 'POSTS_FETCH_END'
export const SET_WP_OBJECT = 'SET_WP_OBJECT'
export const SET_POSTS_CATEGORY = 'SET_POSTS_CATEGORY'
export const SET_POSTS_FILTER = 'SET_POSTS_FILTER'
export const CURRENT_POST_FETCH_START = 'CURRENT_POST_FETCH_START'
export const CURRENT_POST_FETCH_END = 'CURRENT_POST_FETCH_END'
export const UPDATE_ARTICLE_DISPLAY_LIST = 'UPDATE_ARTICLE_DISPLAY_LIST'
export const POSTS_HAS_MORE = 'POSTS_HAS_MORE'
export const CACHE_FEATURED_MEDIA = 'CACHE_FEATURED_MEDIA'
export const CACHE_AUTHOR = 'CACHE_AUTHOR'

// ------------------------------------
// Actions
// ------------------------------------
/*
 * @function reportError
 * dispatch action to set error state
 */
export function reportError() {
  return (dispatch) => {
    dispatch({
      type: LEARN_ERROR
    })
  }
}

/*
 * @function showNotification
 * dispatch action for showing notice snackbar
 */
export function showNotification(message) {
  return (dispatch) => {
    dispatch(notify({ message }))
  }
}

export function setWpObject(wpObject) {
  return (dispatch) => {
    dispatch({ type: SET_WP_OBJECT, payload: wpObject })
  }
}

/*
 * @export function initWpAndLoadCategories
 *  sets the word press query builder instance into store
 *  and fetches all the categories and set into store
 */
export function initWpAndLoadCategories() {
  return (dispatch) => {
    const wpObject = initialiseWpObject()
    dispatch({ type: LCATEGORY_FETCH_START })
    // sets the Wp object into redux store
    dispatch(setWpObject(wpObject))
    // gets the categories
    getCategories(wpObject)
      .then((payload) => {
        dispatch({ type: LCATEGORY_FETCH_END, payload })
      })
      .catch(() => {
        dispatch(reportError())
        dispatch(showNotification('Something went wrong while fetching categories'))
      });
  }
}

/**
 * filters and updates posts.displayList
 * @param {Array} _allPosts array of posts
 * @param {boolean} forceUpdate to skip filtering
 * required since this method needs to be called before POSTS_FETCH_END
 * @returns {null} null
 */
function updateDisplayList(_allPosts, forceUpdate) {
  return (dispatch, getState) => {
    const {
      learn: {
        posts: {
          info,
      category,
      filter
        },
      latestPost
      }
    } = getState();

    const latestPostId = latestPost &&
      latestPost.info &&
      latestPost.info.postDetails &&
      latestPost.info.postDetails.id;

    if (forceUpdate)
      return dispatch({
        type: UPDATE_ARTICLE_DISPLAY_LIST,
        payload: _.filter(_allPosts, o => o.id !== latestPostId)
      });

    // to remove the latest post
    let otherPosts = mergePosts(info, _allPosts);
    otherPosts = _.filter(otherPosts, o => o.id !== latestPostId);

    dispatch({
      type: UPDATE_ARTICLE_DISPLAY_LIST,
      payload: applyCategory(applyFilter(otherPosts, filter), category)
    });
  }
}

function getAndResolvePostDetails(wpObject, post, dispatch, getState) {
  const { learn: { authors, featuredMedias } } = getState();
  let prevAuthor = authors[post.author];
  let prevFeaturedMedia = featuredMedias[post.featured_media];

  if (!prevFeaturedMedia) {
    prevFeaturedMedia = fetchMediaById(wpObject, post.featured_media)
      .then((newFeaturedMedia) => {
        dispatch({ type: CACHE_FEATURED_MEDIA, payload: newFeaturedMedia });
        return newFeaturedMedia;
      });
    dispatch({
      type: CACHE_FEATURED_MEDIA,
      payload: { id: post.featured_media, __promise: prevFeaturedMedia }
    });
  }
  if (!prevAuthor) {
    prevAuthor = fetchAuthorById(wpObject, post.author)
      .then((newAuthor) => {
        dispatch({ type: CACHE_AUTHOR, payload: newAuthor });
        return newAuthor;
      });
    dispatch({
      type: CACHE_AUTHOR,
      payload: { id: post.author, __promise: prevAuthor }
    });
  }

  return Promise.all([
    prevFeaturedMedia.__promise || prevFeaturedMedia,
    prevAuthor.__promise || prevAuthor
  ]);
}

/**
 * fetches posts based on category/filter and sets in store,
 * skips fetching if all posts loaded
 * always fires updateDisplayList() before POSTS_FETCH_END
 * @param {boolean} notInfiniteScroll specifies whether to skip
 * fetching more if temp list has at least 9
 * @returns {null} null
 */
export function getPosts(notInfiniteScroll) {
  return (dispatch, getState) => {
    const {
      learn: {
        categories,
      wpObject,
      posts: {
          info,
        filter,
        category,
        totalPosts,
        continuousPostsUpto
      }
        }
      } = getState();
    const saleId = _.findKey(categories.list, { slug: 'sale' });
    let tempDisplayList = [...info];

    tempDisplayList = applyCategory(applyFilter(tempDisplayList, filter), category);
    dispatch(updateDisplayList(tempDisplayList, true));

    if (info.length && info.length >= totalPosts)
      return;
    if (notInfiniteScroll && tempDisplayList.length >= 9)
      return dispatch({ type: POSTS_HAS_MORE });

    let posts = [];
    let _totalPosts = 0;
    const offset = category === ALL ? continuousPostsUpto : tempDisplayList.length;

    dispatch({ type: POSTS_FETCH_START });
    const count = 10
    const password = 'beep'

    fetchPostsApi({
      wpObject,
      filterDate: filter,
      filterCategory: category,
      excludedCategories: [saleId],
      count,
      offset,
      password
    })
      .then((_posts) => {
        if (!_posts || !_posts.length)
          return;

        posts = [..._posts];
        _totalPosts = _posts._paging.total
        return _posts.map(post => getAndResolvePostDetails(wpObject, post, dispatch, getState));
      })
      .then((promises) => { if (promises && promises.length) return Promise.all(promises); })
      .then((results) => {
        if (!results || !results.length)
          return dispatch({ type: POSTS_FETCH_END });

        _.forEach(results, (result, i) => {
          posts[i].featured_media = result[0];
          posts[i].author = result[1];
        });
        dispatch(updateDisplayList(posts));
        return dispatch({
          type: POSTS_FETCH_END,
          payload: {
            posts,
            totalPosts: _totalPosts,
            continuous: category === ALL
          }
        });
      })
      .catch((error) => {
        console.error(error);
        dispatch(reportError());
        dispatch(notify({ error }));
      })
  }
}

/*
 * @function setPostsCategory
 * dispatch action for changing posts category
 */
export function setPostsCategory(payload) {
  return (dispatch) => {
    dispatch({ type: SET_POSTS_CATEGORY, payload });
    dispatch(getPosts(true));
  }
}

/*
 * @function setPostsFilter
 * dispatch action for changing posts filter
 */
export function setPostsFilter(payload) {
  return (dispatch) => {
    dispatch({ type: SET_POSTS_FILTER, payload });
    dispatch(getPosts(true));
  }
}

/*
 * @function getLatestPost
 *  fetches latest post and set it into store
 */
export function fetchLatestPost() {
  return (dispatch, getState) => {
    const { wpObject } = getState().learn
    let postDetails = ''
    dispatch({ type: LPOST_FETCH_START })
    const count = 1
    const password = 'beep'
    fetchLatestPostsApi({ wpObject, password, count })
      .then((details) => {
        postDetails = details[0] || {}
        return getAndResolvePostDetails(wpObject, details[0], dispatch, getState)
      })
      .then((result) => {
        const featuredMedia = result[0] || {}
        const authorDetails = result[1] || {}
        postDetails.featured_media = featuredMedia
        postDetails.author = authorDetails
        dispatch({
          type: LPOST_FETCH_END,
          payload: {
            postDetails,
            featuredMedia,
            authorDetails
          }
        })
      })
      .catch(() => {
        dispatch(reportError())
        dispatch(showNotification('Something went wrong while fetching Post'))
      })
  }
}

export function getLatestPost() {
  return (dispatch, getState) => {
    const { posts } = getState().learn
    const postList = posts.info || []
    // if already have the post
    if (postList && postList.length) {
      const payload = getSinglePostDetailObj(postList[0])
      dispatch({
        type: LPOST_FETCH_END,
        payload
      })
    } else {
      dispatch(fetchLatestPost())
    }
  }
}
/*
 * @export fetchCurrentPostBySlug fetches the post/article details from api
 * @param {string} slug
 * @dispatches action and set requested post related details at store
 */
export function fetchCurrentPostBySlug(slug) {
  return (dispatch, getState) => {
    const learnDetails = getState().learn || {}
    const wpObject = learnDetails && learnDetails.wpObject
    let postDetails = ''
    const password = 'beep' // getState().user && getState().user && getState().user.info.learnPassword
    dispatch({ type: CURRENT_POST_FETCH_START })
    fetchPostBySlug({ wpObject, slug, password })
      .then((details) => {
        postDetails = details[0] || {}
        return getAndResolvePostDetails(wpObject, details[0], dispatch, getState)
      })
      .then((result) => {
        const featuredMedia = result[0] || {}
        const authorDetails = result[1] || {}
        postDetails.author = authorDetails
        postDetails.featured_media = featuredMedia
        dispatch({
          type: CURRENT_POST_FETCH_END,
          payload: {
            postDetails,
            featuredMedia,
            authorDetails
          }
        })
      })
      .catch(() => {
        // error to be handled here
        dispatch(reportError())
        dispatch(showNotification('Something went wrong while fetching Post'))
      })
  }
}

/*
 *
 * @export getCurrentPostBySlug checks if requested article is already selected
 * @param {string} slug
 * @dispatch action if already selected simply to rerender the component otherwise fetch details
 *  from api
 */
export function getCurrentPostBySlug(slug) {
  return (dispatch, getState) => {
    const { posts } = getState().learn
    const postList = posts.info || []
    const postIndex = _.findIndex(postList, { slug })
    // if already have the post
    if (postIndex !== -1) {
      const payload = getSinglePostDetailObj(postList[postIndex])
      dispatch({
        type: CURRENT_POST_FETCH_END,
        payload
      })
    } else {
      dispatch(fetchCurrentPostBySlug(slug))
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

// stores initial state for Articles categories,
// p.s: all the categories get fetched as user logged in api call is been made at layout file
const categoryInitialState = {
  isFetching: true,
  list: {}
}
// stores initial state for latest post/article,
const lpInitialState = {
  isFetching: true,
  info: {},
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

// stored initial state for learn reducer
export const initialState = {
  categories: categoryInitialState,
  latestPost: lpInitialState,
  posts: postsInitialState,
  currentPost: cpInitialState,
  authors: {},
  featuredMedias: {},
  wpObject: {},
  isError: false
}

const ACTION_HANDLERS = {
  [LCATEGORY_FETCH_START]: state =>
    ({ ...state, categories: { ...state.categories, isFetching: true } }),
  [LEARN_ERROR]: () =>
    ({ ...initialState, isError: true }),
  [LCATEGORY_FETCH_END]: (state, action) =>
    ({ ...state, categories: { ...state.categories, list: action.payload, isFetching: false } }),
  [LPOST_FETCH_START]: state =>
    ({ ...state, latestPost: { ...state.latestPost, isFetching: true } }),
  [LPOST_FETCH_END]: (state, action) =>
    ({ ...state, latestPost: { ...state.latestPost, info: action.payload, isFetching: false } }),
  [POSTS_FETCH_START]: state =>
    ({ ...state, posts: { ...state.posts, isFetching: true } }),
  [POSTS_FETCH_END]: (state, { payload }) => {
    if (!payload)
      return {
        ...state,
        posts: {
          ...state.posts,
          isFetching: false,
          hasMore: false
        }
      };

    const { posts, totalPosts, continuous } = payload;

    return {
      ...state,
      posts: {
        ...state.posts,
        info: posts && posts.length ?
          mergePosts(state.posts.info, posts) :
          state.posts.info,
        totalPosts: state.posts.totalPosts || parseInt(totalPosts, 10),
        isFetching: false,
        hasMore: posts && posts.length && posts.length >= 10,
        continuousPostsUpto: continuous ?
          state.posts.info.length + posts.length :
          state.posts.continuousPostsUpto,
      }
    };
  },
  [POSTS_HAS_MORE]: state => ({ ...state, posts: { ...state.posts, hasMore: true } }),
  [SET_WP_OBJECT]: (state, action) => ({ ...state, wpObject: action.payload }),
  [SET_POSTS_CATEGORY]: (state, { payload: category }) =>
    ({ ...state, posts: { ...state.posts, category } }),
  [SET_POSTS_FILTER]: (state, { payload: filter }) =>
    ({ ...state, posts: { ...state.posts, filter } }),
  [UPDATE_ARTICLE_DISPLAY_LIST]: (state, { payload: displayList }) =>
    ({ ...state, posts: { ...state.posts, displayList } }),
  [CURRENT_POST_FETCH_START]: state =>
    ({ ...state, currentPost: { ...state.currentPost, isFetching: true } }),
  [CURRENT_POST_FETCH_END]: (state, action) =>
    ({ ...state, currentPost: { ...state.currentPost, isFetching: false, info: action.payload } }),
  [CACHE_FEATURED_MEDIA]: (state, { payload }) =>
    ({ ...state, featuredMedias: { ...state.featuredMedias, [payload.id]: payload } }),
  [CACHE_AUTHOR]: (state, { payload }) =>
    ({ ...state, authors: { ...state.authors, [payload.id]: payload } })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function learnReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
