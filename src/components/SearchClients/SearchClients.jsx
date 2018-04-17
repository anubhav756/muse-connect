import React from 'react'
import PropTypes from 'prop-types'
import keycode from 'keycode'
import _ from 'lodash'
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import AutoComplete from 'material-ui/AutoComplete'
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import {
  CircularProgress
} from 'material-ui'
import Icon from '../../components/Icon'

export default class SearchClients extends React.Component {

  state = {
    showClearButton: false,
  }

  constructor(props) {
    super(props)
    this.onNewRequest = this.onNewRequest.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.clearQuery = this.clearQuery.bind(this)
  }

  clearQuery() {
    const autoComplete = this.refs.AutoComplete;
    autoComplete.setState({ searchText: '' });
    this.setState({ showClearButton: false })
  }

  // callback called when user select some item
  onNewRequest(value) {
    const { callBack } = this.props
    if (value.data) {
      callBack(value)
    }
  }

  // selects the first item shown on enter in the searchBar
  onKeyUp(event) {
    const autoComplete = this.refs.AutoComplete
    const key = keycode(event)
    const searchText = autoComplete.state.searchText
    this.setState({ showClearButton: !!searchText.length })

    if (key === 'enter') {
      event.preventDefault()
      autoComplete.close()

      if (searchText !== '' && !!autoComplete.requestsList[0]) {
        const selectedKey = autoComplete.requestsList[0].value.key
        autoComplete.state.searchText = autoComplete.props.dataSource[selectedKey].text
        autoComplete.props.onNewRequest(autoComplete.props.dataSource[selectedKey], -1)
      }
    }
  }

  render() {
    const { dataSource, handleInputChange, loading } = this.props
    return (
      <div style={{ backgroundColor: 'rgba(215, 215, 215, 0.3)', position: 'relative' }}>
        <div style={{ display: 'inline-block', position: 'absolute', top: '8px' }}>
          {
            loading ?
              <CircularProgress color="white" size={16} style={{ opacity: 0.5, marginLeft: 15, verticalAlign: 'middle' }} /> :
              <Icon id="meee" name="search-white-icon" style={{ height: 14, width: 14, verticalAlign: 'middle', marginLeft: '15px' }} />
          }
        </div>
        <div>
          <AutoComplete
            ref="AutoComplete"
            hintText="Search for clients"
            menuStyle={{ maxHeight: '200px', overflowY: 'auto' }}
            dataSource={dataSource}
            fullWidth
            inputStyle={{ color: 'white', fontSize: '13px' }}
            hintStyle={{ color: colors.lightestGrey, fontSize: '13px', bottom: '8px' }}
            underlineStyle={{ display: 'none' }}
            textFieldStyle={{ height: '40px', paddingLeft: '45px', paddingRight: '15px', boxSizing: 'border-box' }}
            onNewRequest={this.onNewRequest}
            filter={AutoComplete.fuzzyFilter}
            onUpdateInput={_.debounce(handleInputChange, 300)}
            onKeyUp={this.onKeyUp}
          />
        </div>
        { this.state.showClearButton &&
          <div style={{ display: 'inline-block', position: 'absolute', top: 0, right: 0 }}>
            <IconButton onClick={this.clearQuery} style={{ width: '40px', height: '40px' }} iconStyle={{ width: '16px', height: '16px' }} >
              <ContentClear color="#fff" />
            </IconButton>
          </div>
        }
      </div>
    )
  }
}

SearchClients.propTypes = {
  dataSource: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  callBack: PropTypes.func.isRequired,
  loading: PropTypes.bool
}
SearchClients.defaultProps = {
  loading: false
}
