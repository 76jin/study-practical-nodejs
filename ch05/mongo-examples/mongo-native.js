var mongo = require('mongodb');
var dbHost = '127.0.0.1';
var dbPort = 27017;

var Db = mongo.Db;
var Server = mongo.Server;
var Connection = mongo.Connection;
var db = new Db('local', new Server(dbHost, dbPort), {safe:true});

db.open(function (error, dbConnection) {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log('db state: ', db._state);

    dbConnection.collection('messages').findOne({}, function (error, item) {
        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.info('findOne: ', item);

        item.text = 'hi';

        var id = item._id.toString();
        console.info('before saving: ', item);

        dbConnection.collection('messages').save(item, function (error, item) {
            console.info('save: ', item);

            dbConnection.collection('messages').find({_id: new mongo.ObjectId(id)})
            .toArray(function (error, items) {
                if (error) {
                    console.error(error);
                    process.exit(1);
                }

                console.info('find: ', items);
                db.close();
                process.exit(0);
            });
        });
    });
});
