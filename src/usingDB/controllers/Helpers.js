import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Helper = {
  /* Hash password */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },

  /* Compare password */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /* Compare email */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  /* Generate Token */
  generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
    process.env.SECRET, { expiresIn: '10d'}
  );
  return token;
  }
}

export default Helper;
