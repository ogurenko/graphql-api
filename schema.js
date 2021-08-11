const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");

const Users = require("./data/users");
const Posts = require("./data/posts");

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(postType),
      resolve(parent, args) {
        const posts = Posts.filter(
          (posts) => posts.user_id === JSON.stringify(parent.id)
        );
        return posts;
      },
    },
  }),
});

const postType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    user_id: { type: GraphQLID },
    user: {
      type: userType,
      resolve(parent, args) {
        const user = Users[parent.user_id - 1];
        return user;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    user: {
      type: userType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const user = Users[args.id - 1];
        return user;
      },
    },
    users: {
      type: GraphQLList(userType),
      resolve(parent, args) {
        const users = Users;
        return users;
      },
    },
    post: {
      type: postType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        const post = Posts[args.id - 1];
        return post;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve(parent, args) {
        return Posts;
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
