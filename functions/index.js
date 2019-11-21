'use strict';

const express = require('express');
const cors = require('cors');

// Firebase init
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Express and CORS middleware init
const relics = express();
relics.use(cors());

const relic = express();
relic.use(cors());

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


// Create relic and get all relics
relics.route('/').post((request, response) => {
 const entry = request.body;

 return admin.firestore().collection('relics').add(entry)
     .then(() => {
      return response.status(200).send(entry)
     }).catch(error => {
      console.error(error);
      return response.status(500).send('Oh no! Error: ' + error);
     });
}).get( (request, response) => {
    let stuff = [];
    const db = admin.firestore();
    return db.collection("relics").get().then(snapshot => {

        snapshot.forEach(doc => {
            let newElement = {
                "id": doc.id,
                "name": doc.data().name,
                "description": doc.data().description,
                "address": doc.data().address,
            };
            stuff = stuff.concat(newElement);
        });
        return response.send(stuff);
    }).catch(reason => {
        response.send(reason)
    })
});
exports.relics = functions.https.onRequest(relics);

// Get relic by id
relic.get('/:id', function (request, response) {
    const id = request.params['id'];
    console.log('getRelic: id', id);
    return admin.firestore().collection('relics').doc(id).get().then(snapshot => {
        return response.send(snapshot.data());
    }).catch(reason => {
        response.send(reason)
    })
});
exports.relic = functions.https.onRequest(relic);


// Listens for any document created in the relics collection
exports.createRelic = functions.firestore
    .document('relics/{id}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        const newValue = snap.data();
        console.log('createRelic: onCreate', newValue);
        const name = newValue.name;
        // perform desired operations ...

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Cloud Firestore.
        // Setting an 'uppercase' field in the Cloud Firestore document returns a Promise.
        return null;
    });
