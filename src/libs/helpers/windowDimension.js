import breakPoints from '!!sass-variable-loader!./../../styles/variables/breakpoints.scss';

export const MOBILE_VIEW = ({ innerWidth }) =>
  innerWidth <= parseInt(breakPoints.breakPointXs, 10);
export const TABLET_VIEW = ({ innerWidth }) =>
  innerWidth > parseInt(breakPoints.breakPointXs, 10) &&
  innerWidth <= parseInt(breakPoints.breakPointSm, 10);
export const DESKTOP_VIEW = ({ innerWidth }) =>
  innerWidth > parseInt(breakPoints.breakPointSm, 10);
