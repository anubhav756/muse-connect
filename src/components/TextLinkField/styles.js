import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss'

export default {
  fieldContainer: {
    position: 'relative'
  },
  hyperLink: {
    fontFamily: 'proxima_novaregular',
    fontSize: 12,
    color: colors.teal,
    textDecoration: 'none',
    cursor: 'pointer'
  },
  linkText: {
    position: 'absolute',
    left: 0,
    bottom: -14
  },
  linkTextInline: {
    position: 'absolute',
    right: 0,
    top: 42
  }
}
