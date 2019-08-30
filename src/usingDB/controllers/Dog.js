import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db/index';

const Dog = {
  async create(req, res) {
    const text = `INSERT INTO
      dogs(id, name, age, breed, owner_id, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
    const values = [
      uuidv4(),
      req.body.name,
      req.body.age,
      req.body.breed,
      req.owner.id,
      moment(new Date()),
      moment(new Date())
    ];
    try {
      const {rows} = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch (e) {
      return res.status(400).send(e);
    }
  },

  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM dogs WHERE owner_id = $1';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.owner.id]);
      return res.status(200).send({ rows, rowCount });
    } catch (e) {
      return res.status(400).send(e)
    }
  },

  async getOne(req, res) {
    const text = `SELECT * FROM dogs WHERE id = $1`;
    try {
      const {rows} = await db.query(text, [req.params.id, req.owner.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'dogs not found'});
      }
      return res.status(200).send(rows[0]);
    } catch (e) {
      return res.status(400).send(e)
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM dogs WHERE id = $1 AND owner_id=$2';
    const updateOneQuery = `UPDATE dogs
      SET name=$1, age=$2, breed=$3, modified_date=$4
      WHERE id=$5 AND owner_id = $6 returning *`;
    try {
       const {rows} = await db.query(findOneQuery, [req.params.id, req.owner.id]);
       if (!rows[0]) {
         return res.status(404).send({'message': 'dogs not found'});
       }
       const values = [
         req.body.name || rows[0].name,
         req.body.age || rows[0].age,
         req.body.breed || rows[0].breed,
         moment(new Date()),
         req.params.id,
         req.owner.id
       ];
       const response = await db.query(updateOneQuery, values);
       return res.status(200).send(response.rows[0]);
    } catch (e) {
      return res.status(400).send(e)
    }
  },

  async delete(req, res) {
    const deleteQuery = 'DELETE FROM dogs WHERE id=$1 AND owner_id=$2 returning *';
    try {
      const {rows} = await db.query(deleteQuery, [req.params.id, req.owner.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'dogs not found'});
      }
      return res.status(204).send({'message': 'deleted'});
    } catch (e) {
      return res.status(400).send(e)
    }
  }
}

export default Dog;
