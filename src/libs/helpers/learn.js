import _ from 'lodash';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import config from '../../config'

const WPAPI = require('wpapi')

let wpInstance = ''

// Article filters
export const ALL = 'ALL';             // <-- also used as 'ALL' categories
export const PAST_WEEK = 'PAST_WEEK';
export const PAST_MONTH = 'PAST_MONTH';

// Deadlines
const pastWeekDeadline = new Date();
const pastMonthDeadline = new Date();
pastWeekDeadline.setDate(pastWeekDeadline.getDate() - 7);
pastMonthDeadline.setMonth(pastMonthDeadline.getMonth() - 1);

// Map to track constant colors for categories
const categoryColors = [
  colors.purple,
  colors.cyan,
  colors.teal,
  colors.green,
  colors.yellow,
  colors.orange,
  colors.pink
];
let categoryColorIndex = 0;

/**
 * merges newPosts into prevPosts, overwriting posts after continuousPostsUpto index
 * @param {Array} prevPosts previously stored posts
 * @param {Array} newPosts newly arrived posts
 * @returns {Array} merged posts
 */
export function mergePosts(prevPosts = [], newPosts = []) {
  return _.orderBy(_.uniqBy([...prevPosts, ...newPosts], 'id'), 'date', 'desc')
}

/*
 * @export function initialiseWpObject creates new word press instance if already not created
 * @returns wp instance
 */
export function initialiseWpObject() {
  if (!wpInstance) {
    const { UTILITY } = config
    wpInstance = new WPAPI({ endpoint: UTILITY.wp_url })
  }
  return wpInstance
}

/*
 * @export function getCategories
 * @returns all the categories
 * @param {object} wpObject querybuilder
 */
export function getCategories(wpObject) {
  return wpObject.categories()
    .then((categories = []) => {
      const categoriesObject = {}
      categories.forEach((category) => {
        categoriesObject[category.id] = category
        categoriesObject[category.id].__categoryColor = categoryColors[categoryColorIndex];
        categoryColorIndex = (categoryColorIndex + 1) % categoryColors.length;
      })
      return categoriesObject
    })
    .catch(() => {
      throw new Error('error')
    })
}

/*
 * @export function fetchLatestPostsApi
 * @returns the latest posts
 * @param {object} wpObject querybuilder
 * @param {[number]} excludedCategories stores the id of categories to be excluded while
 *  fetching latest posts
 * @param {number} count no. of posts to be fetched, default is set to 10
 */
export function fetchLatestPostsApi({ wpObject, excludedCategories, count, password }) {
  return wpObject
    .posts()
    .excludeCategories(excludedCategories)
    .perPage(count || 10)
    .orderby('date')
    .order('desc')
    .password(password)
}

/*
 * @export function fetchMediaById
 * @returns the media details
 * @param {object} wpObject querybuilder
 * @param {number} id stores the id of media for which media is supposed to be fetched
 */
export function fetchMediaById(wpObject, id) {
  if (id) {
    return wpObject.media().id(id)
  }
  return Promise.resolve('no_media')
}

/*
 * @export function fetchAuthorById
 * @param {object} wpObject querybuilder
 * @param {number} authorId stores the id of author for which media is supposed to be fetched
 * @returns author details
 */
export function fetchAuthorById(wpObject, authorId) {
  return wpObject.users().id(authorId)
}

/*
 * @export function fetchPostBySlug
 * @param {object} wpObject querybuilder
 * @param {slug} slug stores the slug of Post for which media is supposed to be fetched
 * @returns post details
 */
export function fetchPostBySlug({ wpObject, slug, password }) {
  return wpObject.posts().slug(slug).password(password)
}

/*
 * @export function fetchAndResolvePostDetails
 * @param {object} wpObject querybuilder
 * @param {object} details stores the details of Post which is supposed to be resolved
 * @returns [media_details, author_details]
 */
export function fetchAndResolvePostDetails(wpObject, details, { fetchFeaturedMedia, fetchAuthor }) {
  return Promise.all([
    fetchFeaturedMedia ? fetchMediaById(wpObject, details.featured_media) : null,
    fetchAuthor ? fetchAuthorById(wpObject, details.author) : null
  ])
}

/**
 * fetches latest posts based on the specified filters, and page number
 * @returns {Promise} promise to resolve the API request
 */
export function fetchPostsApi({
  wpObject,
  filterDate,
  filterCategory,
  page,
  excludedCategories,
  count,
  offset,
  password
}) {
  let api = wpObject
    .posts()
    .page(page)
    .excludeCategories(...excludedCategories)
    .perPage(count || 10)
    .offset(offset || 0)
    .orderby('date')
    .order('desc')
    .password(password);

  if (filterCategory && filterCategory !== ALL)
    api = api.category(filterCategory);
  if (filterDate && filterDate !== ALL)
    api = api.after(
      filterDate === PAST_WEEK ?
        pastWeekDeadline :
        pastMonthDeadline);

  return api;
}

/*
 * @function applyFilter filters the articles with respect to the selected filter type
 * @param {array} articles stores the articles list to be filtered
 * @param {type} selected filter type
 * @returns Array of filtered articles
 */
export function applyFilter(articles = [], type) {
  let deadline = null
  if (type === PAST_WEEK)
    deadline = pastWeekDeadline;
  else if (type === PAST_MONTH)
    deadline = pastMonthDeadline;
  else
    return [...articles];

  return _.filter(articles, o => new Date(o.date) >= deadline);
}

/*
 * @function applyCategory filters the articles with respect to the selected category
 * @param {array} articles stores the articles list to be filtered
 * @param {category} selected category
 * @returns Array of filtered articles
 */
export function applyCategory(articles = [], category) {
  return _.filter(articles, o => category === ALL || o.categories[0].toString() === category);
}

export function getSinglePostDetailObj(postDetails = {}) {
  const featuredMedia = postDetails.featured_media || {}
  const authorDetails = postDetails.author || {}
  return {
    postDetails,
    featuredMedia,
    authorDetails
  }
}

export default {
  initialiseWpObject,
  getCategories,
  fetchAndResolvePostDetails,
  fetchPostBySlug,
  fetchAuthorById,
  fetchMediaById,
  fetchLatestPostsApi,
  getSinglePostDetailObj
}
