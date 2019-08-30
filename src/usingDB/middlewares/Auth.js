import jwt from 'jsonwebtoken';
import db from '../db/index';

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token) {
      return res.status(400).send('Token is not provided');
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM owners WHERE id=$1';
      const {rows} = await db.query(text, [decoded.userId]);
      if(!rows[0]) {
        return res.status(400).send('The token you provided is invalid');
      }
      req.user = { id: decoded.userId };
      next();
    } catch (e) {
      return res.status(400).send(e)
    }
  }
}

export default Auth;
