const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: `${process.env.USER}`,
    host: `${process.env.HOST}`,
    port: process.DATABASEPORT,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DATABASE}`,
});

const newDate = async (values) => {
    const query = {
        text: 'insert into appointments (firstName,lastName,email,phone,appointment, day, time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        values: values
    };
    const result = await pool.query(query);
    return result.rows;
};

const getDate = async (email) => {
    const query = {
        text: 'SELECT * FROM appointments WHERE email = $1',
        values: [email]
    };
    const result = await pool.query(query);
    return result.rows[0];
};

const hoursAvailable = async (day) => {
    const query = {
        text: 'SELECT time FROM appointments where day = $1',
        values: [day]
    }
    const result = await pool.query(query);
    return result.rows;
}

const updateDate = async (values) => {
    const query = {
        text: 'update appointments set appointment = $2, day =$3, time=$4 WHERE email = $1 RETURNING *',
        values
    };
    const result = await pool.query(query);
    return result.rows;
};

const deleteDate = async (email) => {
    const query = {
        text: 'delete from appointments where email = $1 RETURNING *',
        values: [email]
    };
    const result = await pool.query(query);
    return result.rows;
};

module.exports = { newDate, getDate, updateDate, deleteDate, hoursAvailable };