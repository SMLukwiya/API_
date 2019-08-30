import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db/index';
import Helper from './Helpers';

const Owner = {
  /* Create Owner */
  async create(req, res) {
    if(!req.body.email || !req.body.password) {
      return res.status(400).send('required fields are missing')
    }
    if(!Helper.isValidEmail(req.body.email)) {
      return ers.status(400).send('Please enter a valid email Address');
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
        owners(id, email, password, created_date, modified_date)
        VALUES($1, $2, $3, $4, $5)
        returning *`;
    const values = [
      uuidv4(),
      req.body.email,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const {rows} = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({token});
    } catch (e) {
      if(e.routine === '_bt_check_unique') {
        return res.status(400).send({'message': 'This email is already in use'})
      }
      return res.status(400).send(e)
    }
  },

  /* Login */
  async login(req, res) {
    if(!req.body.email || !req.body.password) {
      return res.status(400).send('Enter your credentials');
    }
    if(!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send('Please enter a valid email');
    }
    const text = 'SELECT * FROM owners WHERE email = $1';
    try {
      const {rows} = await db.query(text, [req.body.email]);
      if(!rows[0]) {
        return res.status(400).send('incorrect credentials');
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send('password is incorrect');
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(200).send({token})
    } catch (e) {
      return res.status(400).send(e)
    }
  },

  /* Delete an Owner */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM owners WHERE id = $1 returning *';
    try {
      const {rows} = await db.query(deleteQuery, [req.owner.id]);
      if(!rows[0]) {
        return res.status(404).send('owner not found');
      }
      return res.status(204).send('successfully deleted');
    } catch (e) {
      return res.status(400).send(e);
    }
  }
}

export default Owner;
