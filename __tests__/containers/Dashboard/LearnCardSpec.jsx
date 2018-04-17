import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { mount } from 'enzyme'
import should from 'should'
import sinon from 'sinon'
import 'should-sinon'

import { getMuiTheme } from 'material-ui/styles'
import { Learn } from '../../../src/containers/Dashboard/Cards/Learn'

const getLatestPostSpy = sinon.spy()

const getContext = () => ({
  muiTheme: getMuiTheme(),
})

const Props = {
  learn: {
    categories: {
      isFetching: true
    },
    latestPost: {
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
          }
        }
      }
    },
    isError: false
  },
  getLatestPost: getLatestPostSpy
}

describe('(Dashboard view) Learn Card', () => {
  let contextRef = null
  beforeAll(() => {
    contextRef = getContext()
  })

  const buildWrapper = () => (
    mount(<Learn learn={Props.learn} getLatestPost={Props.getLatestPost} />, {
      context: contextRef,
      childContextTypes: {
        muiTheme: PropTypes.object,
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
    it('should fetch latest post too if component get rendered before fetching categories', () => {
      const learn = _.cloneDeep(Props.learn)
      learn.categories.isFetching = false
      wrapper.setProps({ learn })
      getLatestPostSpy.should.be.called()
    })
  })
})
