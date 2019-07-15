import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, ctx, info) {
      const userId = getUserId(ctx.request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  }
};

export default User;