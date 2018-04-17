import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Paper,
  FlatButton
} from 'material-ui';
import Delete from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/image/edit';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import { MOBILE_VIEW } from '../../libs/helpers/windowDimension';
import AddEditNote from '../../components/AddEditNote';
import alert from '../Modal/CancelModal';
import { cleverTapDeleteNote } from '../../libs/cleverTap'
import './ClientNoteItem.scss';

function handleDelete(id) {
  alert('Are you sure you want to delete this note?')
    .then(() => {
      this.props.deleteNote(id)
      cleverTapDeleteNote()
    })
    .catch(() => { });
}

export default class ClientNoteItem extends Component {
  constructor() {
    super();

    this.state = {
      expand: false
    }

    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleDelete = handleDelete.bind(this);
  }
  toggleExpand() {
    this.setState({
      expand: !this.state.expand
    });
  }
  render() {
    const { title, content, disabled, createdAt, id, wd } = this.props;
    const { expand } = this.state;

    return (
      <Paper style={{ background: 'white', padding: MOBILE_VIEW(wd) ? 12 : 20 }}>
        <div className="dateClientNoteItem">{moment(createdAt).format(MOBILE_VIEW(wd) ? 'YYYY-MM-DD' : 'MMM D, YYYY')}</div>
        <div className="containerNoteItem">
          <div className={expand ? 'headerExpandClientNoteItem' : 'headerClientNoteItem'}>{title}</div>
          <div className="buttonContainerNoteItem">
            <AddEditNote
              {...this.props}
              editNote
              component={<FlatButton
                style={{
                  color: disabled ? colors.lightGrey : colors.mediumGrey,
                  fontFamily: 'proxima_novasemibold',
                  fontSize: 14,
                  minWidth: MOBILE_VIEW(wd) ? 40 : 88
                }}
                disabled={disabled}
              >
                <Edit
                  style={{
                    fill: disabled ? colors.lightGrey : colors.mediumGrey,
                    height: 20,
                    marginBottom: -5,
                    marginRight: 6
                  }}
                />
                {!MOBILE_VIEW(wd) && 'Edit'}
              </FlatButton>}
            />
            <FlatButton
              onClick={() => { this.handleDelete(id) }}
              style={{
                color: disabled ? colors.lightGrey : colors.mediumGrey,
                fontFamily: 'proxima_novasemibold',
                fontSize: 14,
                minWidth: MOBILE_VIEW(wd) ? 40 : 88
              }}
              disabled={disabled}
            >
              <Delete
                style={{
                  fill: disabled ? colors.lightGrey : colors.mediumGrey,
                  height: 20,
                  marginBottom: -5,
                  marginRight: 6
                }}
              />
              {!MOBILE_VIEW(wd) && 'Delete'}
            </FlatButton>
          </div>
          <div className={expand ? 'bodyExpandClientNoteItem' : 'bodyClientNoteItem'}>{content}</div>
          <a
            role="button"
            tabIndex="0"
            onClick={this.toggleExpand}
            className="hyperLink"
          >
            {expand ? 'View less' : 'View more'}
          </a>
        </div>
      </Paper>
    )
  }
}
ClientNoteItem.propTypes = {
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  wd: PropTypes.object.isRequired,
  disabled: PropTypes.bool
}
ClientNoteItem.defaultProps = {
  disabled: false
}
