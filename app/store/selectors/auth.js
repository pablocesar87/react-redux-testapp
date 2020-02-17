export const authSelectors = {
  getIsFetching: state => state.auth.isFetching,
  getMe: state => state.auth.me,
  isUserLogged: state => !!state.auth.me.id,
};
