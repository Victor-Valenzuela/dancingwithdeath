const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { newDate, getDate, updateDate, deleteDate, hoursAvailable } = require("./app/functions");
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta inicializado en el puerto ${port}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/public/assets/css'));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'handlebars');

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'main',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
    })
);

app.get('/', async (_req, res) => {
    res.render('Home')
})

app.get('/date', (_req, res) => {
    res.render('Date');
})

app.get('/myDate', async (req, res) => {
    const body = req.query;
    const user = await getDate(body.email);
    const firstName = user.firstname;
    const lastName = user.lastname;
    const email = user.email;
    const phone = user.phone;
    const appointment = user.appointment.split(' ');
    const date = appointment[0];
    const hour = appointment[1];
    res.render('Mydate', { firstName, lastName, email, phone, date, hour });
})

app.post('/date', async (req, res) => {
    const { firstName, lastName, email, phone, day, hour } = req.body;
    try {
        const user = await getDate(email);
        if (user) res.status(200).send({ error: 'Email already exists', code: 200 });
        else {
            const newUser = await newDate([firstName, lastName, email, phone, `${day + ' ' + hour}`, day, hour]);
            res.status(200).send({ newUser, success: 'Your appointment has been scheduled' });

        }
    } catch (error) {
        res.status(500).send({
            error: `Date or hour is already taken, please select another one`,
            code: 500
        });
    }
});

app.put('/update', async (req, res) => {
    const { email, day, hour } = req.body;
    try {
        const update = await updateDate([email, `${day + ' ' + hour}`, day, hour]);
        if (update[0]) res.status(200).send({ success: 'Your appointment has been updated' });
        else res.status(200).send({ error: 'This email no longer has scheduled appointments' });
    } catch (error) {
        res.status(500).send({
            error: `Date or hour is already taken, please select another one`,
            code: 500
        });
    }
})

app.delete('/delete/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await deleteDate(email);
        if (user[0]) res.status(200).send({ success: 'Your appointment has been deleted' });
        else res.status(200).send({ error: 'This email no longer has scheduled appointments' });
    } catch (e) {
        res.status(500).send({
            error: `Something went wrong... ${e}`,
            code: 500
        })
    }
})

app.post('/verify', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await getDate(email);
        if (user) res.status(200).send({ success: 'This mail have one appointment' });
        else res.status(200).send({ error: 'This email has no appointments' });
    } catch (e) {
        res.status(500).send({
            error: e,
            code: 500
        })
    }
});

app.post('/hours', async (req, res) => {
    const { day } = req.body;
    try {
        const hours = await hoursAvailable(day);
        const notAvailable = hours.map(hour => hour.time)
        res.status(200).send({ notAvailable });
    } catch (e) {
        res.status(500).send({
            error: e,
            code: 500
        })
    }
}
)

