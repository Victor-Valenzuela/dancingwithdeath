const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: `${process.env.user}`,
    host: `${process.env.host}`,
    port: process.port,
    password: `${process.env.password}`,
    database: `${process.env.database}`,
});

async function newDate(firstName, lastName, email, phone, appointment, hour) {
    try {
        const result = await pool.query(
            `INSERT INTO appointments
            (firstName,lastName,email,phone,appointment)
            VALUES ('${firstName}','${lastName}','${email}','${phone}','${appointment + ' ' + hour}') RETURNING *`);
        console.log(`Appointment by ${result.rows[0].firstname} created successfully`);
        return result.rows;
    } catch (error) {
        console.log('Date or hour is already taken', e);
        return error;
    }
}

async function getDate(email) {
    try {
        const result = await pool.query(`SELECT * FROM appointments WHERE email = '${email}'`)
        return result.rows[0];
    } catch (error) {
        console.log('Email not found', e);
        return error;
    }
}

async function updateDate(email, appointment, hour) {
    try {
        const result = await pool.query(
            `update appointments set appointment = '${appointment + ' ' + hour}' WHERE email = '${email}' RETURNING *`);
        console.log(`Appointment updated successfully`);
        return result.rows;
    } catch (error) {
        console.log('Date is already taken', e);
        return error;
    }
}
async function deleteDate(email) {
    try {
        const result = await pool.query(`DELETE FROM appointments WHERE email = '${email}' RETURNING *`);
        console.log('Appointment deleted successfully');
        return result.rows;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { newDate, getDate, updateDate, deleteDate };