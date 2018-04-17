/* eslint import/no-unresolved: 0 */
import colors from '!!sass-variable-loader!./variables/colors.scss'

export default {
  fontFamily: 'proxima_novaregular, Arial, Helvetica Neue, Helvetica, sans-serif',
  palette: {
    primary1Color: colors.teal,
    primary2Color: colors.lightTeal,
    accent1Color: colors.cyan,
    accent2Color: colors.lightCyan,
    canvasColor: colors.background,
    textColor: colors.darkGrey
  }
};
