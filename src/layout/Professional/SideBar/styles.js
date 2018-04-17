import colors from '!!sass-variable-loader!./../../../styles/variables/colors.scss'

export default {
  headerContainer: {
    backgroundColor: colors.teal,
    height: 199
  },
  header: {
    width: '100%',
    height: '100%',
    paddingTop: 36
  },
  flatButton: {
    position: 'absolute',
    top: 15,
    left: -10
  },
  cross: {
    height: 18,
    width: 18
  },
  avatarContainer: {
    textAlign: 'center'
  },
  name: {
    fontFamily: 'proxima_novaregular',
    color: colors.lightestGrey,
    fontSize: 19,
    textAlign: 'center',
    marginBottom: 0
  },
  teamName: {
    fontFamily: 'proxima_novasemibold',
    color: colors.lightestGrey,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: -12
  },
  listContainer: {
    marginTop: 20
  },
  listItem: {
    paddingLeft: 20,
    fontFamily: 'proxima_novasemibold',
    fontSize: 14.8,
    color: colors.darkGrey
  },
  secondaryListItem: {
    paddingLeft: 20,
    fontFamily: 'proxima_novaregular',
    fontSize: 14.8,
    color: colors.darkGrey
  },
  selectedListItem: {
    color: colors.lightestGrey,
    background: colors.lightTeal
  },
  divider: {
    backgroundColor: colors.lightestGrey,
    marginTop: 10,
    marginBottom: 10
  },
  navIcon: {
    width: 20,
    heigth: 20
  },
  secondaryNavIcon: {
    width: 18,
    heigth: 18
  }
}
