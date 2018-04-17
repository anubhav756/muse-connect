import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Paper,
  FloatingActionButton
} from 'material-ui';
import NoteAdd from 'material-ui/svg-icons/action/note-add';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import AddEditNote from '../../components/AddEditNote'
import { MOBILE_VIEW } from '../../libs/helpers/windowDimension';
import SortableColumnHeading from '../../components/SortableColumnHeading';
import ClientNoteItem from '../../components/ClientNoteItem';
import { getNotes, applyNotesSort as _applyNotesSort, deleteNote as _deleteNote, updateNote as _updateNote, addNote as _addNote } from '../../redux/modules/notes';
import { CREATED_DATE, NOTE_TITLE } from '../../libs/helpers/notes';
import Loader from '../../components/Loader/ContentLoader';
import NoResultFound from '../../components/NoResultFoundCard'
import { cleverTapViewNote } from '../../libs/cleverTap'
import './ClientNotes.scss';

const sortableColumnHeadingStyle = {
  color: colors.mediumGrey,
  fontFamily: 'proxima_novasemibold',
  fontSize: 14,
  display: 'inline-block',
  textAlign: 'left'
}

class ClientNotes extends React.Component {
  componentWillMount() {
    cleverTapViewNote()
    this.props.getNotes(this.props.clientId)
  }

  render() {
    const {
      notes: {
        isFetching,
      isError,
      info,
      isAction,
      sortByColumn,
      reverse
      },
      applyNotesSort,
      ...otherProps
    } = this.props
    const { wd } = otherProps
    if (isError) {
      return (<NoResultFound text={'Something went wrong while loading details...'} />)
    }
    if (isFetching) {
      return (<Loader />)
    }
    return (
      <div>
        <div className="buttonContainerClientNotes">
          <AddEditNote
            disabled={isAction}
            {...otherProps}
            component={
              <FloatingActionButton
                disabled={isAction}
                mini={MOBILE_VIEW(wd)}
                style={MOBILE_VIEW(wd) ? {
                  position: 'absolute',
                  right: 8,
                  bottom: -36
                } : {
                  position: 'absolute',
                  right: 0,
                  top: -20
                }}
              >
                <NoteAdd />
              </FloatingActionButton>
            }
          />
        </div>
        <div className="headerContainerClientNotes">
          <SortableColumnHeading
            columnLabel="Date"
            onClick={() => applyNotesSort(CREATED_DATE)}
            isSortColumn={sortByColumn === CREATED_DATE}
            reverse={reverse}
            disabled={isAction}
            style={{
              ...sortableColumnHeadingStyle,
              width: MOBILE_VIEW(wd) ? 64 : 140,
              marginLeft: MOBILE_VIEW(wd) ? 10 : 20
            }}
          />
          <SortableColumnHeading
            columnLabel="Note"
            onClick={() => applyNotesSort(NOTE_TITLE)}
            isSortColumn={sortByColumn === NOTE_TITLE}
            reverse={reverse}
            disabled={isAction}
            style={{
              ...sortableColumnHeadingStyle,
              width: MOBILE_VIEW(wd) ? 64 : 140,
              marginLeft: MOBILE_VIEW(wd) ? 10 : 20
            }}
          />
        </div>
        {
          !info || !info.length ? (
            <Paper
              style={{
                background: 'white',
                padding: 30,
                paddingBottom: 50,
                color: colors.mediumGrey,
                fontStyle: 'italic',
                fontSize: 14
              }}
            >
              {'You don\'t currently have any notes.'}
            </Paper>
          ) :
            info.map(note => <ClientNoteItem
              key={note.id}
              {...note}
              disabled={isAction}
              {...otherProps}
            />)
        }
      </div>
    )
  }
}

ClientNotes.propTypes = {
  wd: PropTypes.object.isRequired,
  notes: PropTypes.object.isRequired,
  getNotes: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  updateNote: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  applyNotesSort: PropTypes.func.isRequired
}

function mapStateToProps({ notes, windowDimension: wd }) {
  return { notes, wd }
}
export default connect(
  mapStateToProps, {
    getNotes,
    deleteNote: _deleteNote,
    applyNotesSort: _applyNotesSort,
    updateNote: _updateNote,
    addNote: _addNote,
  })(ClientNotes)
