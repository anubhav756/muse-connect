import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';

module.exports = {
  modal: {
    zIndex: 10001
  },
  title: {
    fontFamily: 'proxima_novabold',
    color: colors.darkGrey,
    fontSize: '20px',
    paddingLeft: '42px',
    paddingRight: '48px'
  },
  subTitle: {
    fontFamily: 'proxima_novaregular',
    color: colors.darkGrey,
    fontSize: '18px'
  },
  titleContainer: {
    marginRight: '0px'
  },
  xIcon: {
    position: 'absolute',
    top: 12,
    right: 12
  },
  iconContainer: {
    width: 16,
    height: 16
  },
  bodyStyle: {
    paddingLeft: 42,
    paddingRight: 26,
    marginRight: 16,
  },
  overlayStyle: {
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
}
