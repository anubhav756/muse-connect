import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PageTitle from '../../components/PageTitle';
import { PostsCategory, PostsFilter } from '../../components/SelectDropDown';
import MainArticleCard from './MainArticleCard';
import ArticleCardsWrapper from './ArticleCardsWrapper';

import './Learn.scss';

function Learn() {
  return (
    <Row center="xs">
      <Col xs={11} md={9}>
        <Row start="xs">
          <Col xs={12}>
            <PageTitle text="Muse Learn" offset={10} style={{ marginLeft: 10, marginRight: 10 }} />
          </Col>
        </Row>
        <Row start="xs" style={{ marginTop: 10 }}>
          <Col xs={12}>
            <MainArticleCard />
          </Col>
        </Row>
        <Row start="xs" className="OtherArticlesContainerLearn">
          <Col xs={12}>
            <div className="DropdownContainerLearn">
              <div className="DropdownLabelLearn">Show</div>
              <PostsFilter style={{ width: 'auto' }} labelStyle={{ paddingRight: 30 }} />
            </div>
            <div className="DropdownContainerLearn">
              <div className="DropdownLabelLearn">Category</div>
              <PostsCategory style={{ width: 'auto' }} labelStyle={{ paddingRight: 30 }} />
            </div>
          </Col>
        </Row>
        <ArticleCardsWrapper style={{ marginTop: 20 }} />
      </Col>
    </Row>
  );
}

export default Learn;
