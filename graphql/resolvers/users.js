const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {validateRegisterInput} = require('../../util/validators')
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    async login(_, {username, password}){
      const {errors, valid} = validateLoginInput(username, password);
      const user = await User.findOne({username});

      if(!user){
        errors.general ='User not found';
        throw new UserInputError('User not found', {errors});
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match){
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', {errors});
      }
      const token
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // TODO: Validate user data
      const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid) {
        throw new UserInputError('Errors', {errors});
      }
      // TODO: Make user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("User already exists", {
          errors: {
            username: "This user already exists",
          },
        });
      }

      // Hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
