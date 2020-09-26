const moongoose = require('mongoose');

const { GREET_APP_HOST, GREET_APP_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${GREET_APP_HOST}/${GREET_APP_DATABASE}`;
moongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(db => console.log('DB connected succesfully'))
.catch(err => console.log(err));