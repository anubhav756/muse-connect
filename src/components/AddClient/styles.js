import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';

export default {
  container: {
    maxWidth: 600
  },
  labelStyle: {
    fontFamily: 'proxima_novasemibold'
  },
  input: {
    backgroundColor: colors.white,
    fontFamily: 'proxima_novaregular',
    fontSize: 17,
    color: colors.darkGrey,
    width: '100%',
    padding: '12px 20px',
    boxSizing: 'border-box',
    border: `2px solid ${colors.mediumGrey}`,
    outline: 'none'
  },
  description: {
    marginTop: 28,
    fontFamily: 'proxima_novamedium',
    color: colors.mediumGrey
  }
}
