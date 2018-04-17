import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Paper,
  FlatButton,
  Divider
} from 'material-ui'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import { MOBILE_VIEW, DESKTOP_VIEW } from '../../libs/helpers/windowDimension'
import Icon from '../Icon'

import './EditableLabel.scss'

class EditableLabel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      value: props.value,
      validationMsg: ''
    }
  }
  refreshField = () => {
    const { value, tabIndex } = this.props
    this.setState({ value }, () => {
      document.getElementById(`inputEditableLabel-${tabIndex}`).select()
    })
  }
  toggleEditMode = (_editMode) => {
    const { onChange, value: displayValue, labelOnly, tabIndex } = this.props
    const { value, editMode, validationMsg } = this.state
    const _validationMsg = validationMsg
    if (labelOnly)
      return

    this.setState({ editMode: _editMode, validationMsg: '' }, () => {
      if (_editMode) {
        document.getElementById(`inputEditableLabel-${tabIndex}`).focus()
        if (!editMode)
          this.refreshField()
      }
      if (editMode && !_editMode && value && value !== displayValue && !_validationMsg)
        onChange(value)
    })
  }
  handleChange = (value) => {
    const { validation } = this.props
    const validationMsg = validation(value)
    this.setState({ validationMsg, value })
  }
  renderTitleAndLabel() {
    const {
      title,
      value: displayValue,
      type,
      labelStyle,
      loading,
      tabIndex
    } = this.props
    const {
      editMode,
      value
    } = this.state

    if (typeof (displayValue) === 'object' && typeof (title) === 'object') {
      const containers = []

      for (let i = 0; i < displayValue.length; i += 1)
        containers.push(
          <div key={i} className="LabelTitleContainerEditableLabel">
            <div className="LabelEditableLabel">
              {title[i]}
            </div>
            <div className="InputEditableLabel" style={{ labelStyle }}>
              {displayValue[i]}
            </div>
          </div>
        )

      return containers
    }

    return (
      <div>
        <div className="LabelEditableLabel">
          {title}
        </div>
        {
          editMode
            ? <input
              id={`inputEditableLabel-${tabIndex}`}
              value={value}
              type={type}
              onChange={e => this.handleChange(e.target.value)}
              onBlur={() => this.toggleEditMode(false)}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  this.toggleEditMode(false)
                }
              }}
              className="InputEditableLabel-edit"
            />
            : <input
              type={type}
              value={displayValue}
              disabled
              className="InputEditableLabel"
              style={{ ...(loading ? { color: colors.lightGrey } : null), ...labelStyle }}
            />
        }
      </div>
    )
  }
  renderEditLabel() {
    const {
      editLabel,
      editClick,
      loading,
      iconNames,
      iconSizes,
      verticalButtons,
      wd
      } = this.props

    if (!editLabel)
      return

    if (typeof (editLabel) === 'object')
      return (
        editLabel.map((_editLabel, i) => (
          <FlatButton
            key={_editLabel}
            disableTouchRipple
            onClick={editClick[i]}
            hoverColor="transparent"
            style={{
              display: verticalButtons ? 'block' : 'inline-block',
              minWidth: 40,
              marginRight: i + 1 >= editLabel.length ?
                0 :
                DESKTOP_VIEW(wd) ?
                  40 :
                  20
            }}
          >
            <div className="LabelEditableLabel" style={loading ? { color: colors.lightGrey } : null}>
              {
                iconNames[i] ?
                  <Icon
                    name={iconNames[i]}
                    fill={loading ? colors.lightGrey : colors.mediumGrey}
                    style={{
                      height: iconSizes[i],
                      width: iconSizes[i],
                      marginBottom: -3,
                      marginRight: 10
                    }}
                  /> :
                  <ModeEdit
                    color={loading ? colors.lightGrey : colors.mediumGrey}
                    style={{
                      height: iconSizes[i],
                      width: iconSizes[i],
                      marginBottom: -3,
                      marginRight: 10
                    }}
                  />
              }

              {DESKTOP_VIEW(wd) && _editLabel}
            </div>
          </FlatButton>
        ))
      )

    return (
      <FlatButton disableTouchRipple hoverColor="transparent" onClick={editClick} style={{ minWidth: 40 }}>
        <div className="LabelEditableLabel" style={loading ? { color: colors.lightGrey } : null}>
          {
            iconNames && iconNames[0] ?
              <Icon
                name={iconNames[0]}
                fill={loading ? colors.lightGrey : colors.mediumGrey}
                style={{
                  height: iconSizes[0],
                  width: iconSizes[0],
                  marginBottom: -3,
                  marginRight: 10
                }}
              /> :
              <ModeEdit
                color={loading ? colors.lightGrey : colors.mediumGrey}
                style={{
                  height: iconSizes[0],
                  width: iconSizes[0],
                  marginBottom: -3,
                  marginRight: 10
                }}
              />
          }
          {DESKTOP_VIEW(wd) && editLabel}
        </div>
      </FlatButton>
    )
  }
  render() {
    const {
      className,
      tabIndex,
      extraLabel,
      loading,
      style,
      verticalButtons,
      wd
      } = this.props
    const { editMode, validationMsg } = this.state
    return (
      <Paper
        className={className}
        id={`containerEditableLabel-${tabIndex}`}
        tabIndex={loading ? null : tabIndex}
        onFocus={() => this.toggleEditMode(true)}
        rounded={false}
        zDepth={DESKTOP_VIEW(wd) ? 1 : 0}
        style={{ minHeight: 103, backgroundColor: 'white', position: 'relative', padding: 30, outline: 'none', ...style }}
      >
        {
          !editMode &&
          <div className={verticalButtons ? 'RightMultiContainerEditableLabel' : 'RightContainerEditableLabel'}>
            {
              extraLabel && !MOBILE_VIEW(wd) &&
              <div className="ExtraLabelEditableLabel" style={loading ? { color: colors.lightGrey } : null}>
                {extraLabel}
              </div>
            }
            {this.renderEditLabel()}
          </div>
        }
        <div className="LeftContainerEditableLabel">
          {this.renderTitleAndLabel()}
          <div style={{ zIndex: 0, position: 'absolute', bottom: '10px', fontSize: '14px', color: colors.red }}>{validationMsg}</div>
        </div>
        {
          !DESKTOP_VIEW(wd) &&
          <Divider
            style={{
              marginLeft: -30,
              marginRight: -30,
              marginBottom: -30,
              marginTop: editMode ? 55 : 30,
              background: colors.lightestGrey
            }}
          />
        }
      </Paper>
    )
  }
}

EditableLabel.propTypes = {
  tabIndex: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.any)
  ]).isRequired,
  type: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  editLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  extraLabel: PropTypes.string,
  onChange: ({ labelOnly, onChange }, propName, componentName) => {
    if (!labelOnly && !onChange)
      return new Error(
        `Missing prop '${propName}' in '${componentName}'. Set 'labelOnly' to true if not required.`
      )
  },
  editClick: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func)
  ]),
  iconSizes: PropTypes.arrayOf(PropTypes.number),
  loading: PropTypes.bool,
  style: PropTypes.object,
  wd: PropTypes.object.isRequired,
  labelOnly: PropTypes.bool.isRequired,
  labelStyle: PropTypes.object,
  iconNames: PropTypes.arrayOf(PropTypes.string),
  verticalButtons: PropTypes.bool,
  validation: PropTypes.func
}
EditableLabel.defaultProps = {
  type: 'text',
  extraLabel: null,
  loading: false,
  style: null,
  editLabel: null,
  labelOnly: false,
  labelStyle: null,
  onChange: null,
  iconNames: null,
  iconSizes: [15],
  editClick: () => { },
  verticalButtons: false,
  validation: () => ('')
}

export default connect(({ windowDimension: wd }) => ({ wd }))(EditableLabel)
