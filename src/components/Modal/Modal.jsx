import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import styles from './styles';
import Icon from '../Icon';

function Modal({
  title,
  subTitle,
  open,
  toggleModal,
  children,
  iconName,
  iconStyle,
  titleStyle,
  subTitleStyle,
  autoScrollBodyContent,
  style,
  actions,
  containerStyle,
  contentClassName,
  childrenStyle,
  childrenClassName,
  showCross,
  ...otherprops
}) {
  return (
    <Dialog
      title={
        <div style={styles.titleContainer}>
          {title}
          {subTitle && <div style={subTitleStyle}>{subTitle}</div>}
          {
            showCross &&
            <IconButton
              iconStyle={{ height: 16, width: 16 }}
              style={{ ...styles.xIcon, ...iconStyle }}
              onClick={toggleModal}
            >
              <Icon name={iconName} style={styles.iconContainer} />
            </IconButton>
          }
        </div>
      }
      titleStyle={{ ...styles.title, ...titleStyle }}
      contentClassName={contentClassName}
      open={open}
      onRequestClose={toggleModal}
      autoScrollBodyContent={autoScrollBodyContent}
      style={{ ...styles.modal, ...containerStyle }}
      contentStyle={style}
      bodyStyle={{ ...styles.bodyStyle, ...childrenStyle }}
      bodyClassName={`scrollbarModal ${childrenClassName}`}
      overlayStyle={styles.overlayStyle}
      actions={actions}
      {...otherprops}
    >
      {children}
    </Dialog>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  iconName: PropTypes.string,
  contentClassName: PropTypes.string,
  titleStyle: PropTypes.object,
  subTitleStyle: PropTypes.object,
  autoScrollBodyContent: PropTypes.bool,
  actions: PropTypes.array,
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  childrenStyle: PropTypes.object,
  childrenClassName: PropTypes.string,
  showCross: PropTypes.bool
}
Modal.defaultProps = {
  subTitle: null,
  subTitleStyle: styles.subTitle,
  iconName: 'x-icon',
  titleStyle: {},
  autoScrollBodyContent: true,
  style: null,
  actions: null,
  containerStyle: {},
  childrenStyle: {},
  contentClassName: '',
  showCross: true,
  iconStyle: {},
  childrenClassName: ''
}

export default Modal;
