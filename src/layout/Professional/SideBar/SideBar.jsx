import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import SelectableList from '../../../components/SelectableList';
import UserAvatar from '../../../components/UserAvatar';
import Icon from '../../../components/Icon';
import styles from './styles';
import endPoints from '../../../routes/endPoints';

const navList = [
  {
    url: endPoints.dashboard,
    text: 'Dashboard',
    icon: 'home-icon'
  },
  {
    url: endPoints.clients,
    matchUrl: [endPoints.clients, endPoints.client.index],
    text: 'Clients',
    icon: 'clients-icon'
  },
  {
    url: endPoints.shop,
    text: 'Store',
    icon: 'cart-icon'
  },
  {
    url: endPoints.learn,
    text: 'Learn',
    icon: 'bookmark-icon'
  }
];
function navListIndexOf(url) {
  return _.findIndex(navList, item => (
    _.indexOf(item.matchUrl, url) > -1 ||
    item.url === url
  ));
}

export class SideBarComponent extends Component {
  constructor(props) {
    super(props);
    this.navListItem = this.navListItem.bind(this);
  }
  handleNavClick(url) {
    this.props.toggleSideBar();
    browserHistory.push(url);
  }
  navListItem(index) {
    const secondary = index > 1;
    const selected = index === navListIndexOf(this.props.currentRoute)
    return (
      <ListItem
        value={index}
        onClick={() => this.handleNavClick(navList[index].url)}
        style={{
          ...(secondary ? styles.secondaryListItem : styles.listItem),
          ...(selected ? styles.selectedListItem : null)
        }}
        primaryText={navList[index].text}
        leftIcon={<Icon
          name={navList[index].icon}
          style={secondary ? styles.secondaryNavIcon : styles.navIcon}
        />}
      />
    )
  }
  render() {
    const {
      user: {
        info: {
          firstName, lastName, avatar , businessName
        }
      }
    } = this.props;

    return (
      <Drawer
        width={window.innerWidth <= 480 ? window.innerWidth : 270}
        open={this.props.open}
        onRequestChange={this.props.toggleSideBar}
        docked={false}
        overlayStyle={{ opacity: 0 }}
        containerStyle={{ overflow: 'hidden' }}
      >
        <Paper
          rounded={false}
          style={styles.headerContainer}
        >
          <FlatButton
            onClick={() => this.handleNavClick(endPoints.account.index)}
            style={styles.header}
          >
            <div style={styles.avatarContainer}>
              <UserAvatar
                user={{ profile: avatar, firstName, lastName }}
                size={75}
                fontSize={30}
              />
            </div>
            <p style={styles.name}>{`${firstName} ${lastName}`}</p>
            <p style={styles.teamName}>{businessName}</p>
          </FlatButton>
          <FlatButton
            style={styles.flatButton}
            icon={<Icon name="x-reversed-icon" style={styles.cross} />}
            onClick={this.props.toggleSideBar}
          />
        </Paper>
        <SelectableList
          value={navListIndexOf(this.props.currentRoute)}
          style={styles.listContainer}
        >
          {this.navListItem(0)}
          {this.navListItem(1)}
          <Divider style={styles.divider} />
          {this.navListItem(2)}
          {this.navListItem(3)}
        </SelectableList>
      </Drawer>
    )
  }
}

SideBarComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  currentRoute: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}

function mapStateToProps({ routing: { locationBeforeTransitions: { pathname } }, user }) {
  return {
    currentRoute: `/${pathname.split('/')[1]}`,
    user
  };
}

export default connect(mapStateToProps)(SideBarComponent);
