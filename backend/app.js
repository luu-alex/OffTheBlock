const http = require('http');
const ethers = require('ethers');
var express = require('express')
var firebase = require("firebase");
var firestore = require("firebase/firestore");
const functions = require('firebase-functions');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var FormData = require('form-data');
const axios = require('axios');
var admin = require("firebase-admin");
var serviceAccount = require("./auth.json");
var fs = require('fs');
var sha256 = require("sha256");
const crypto = require("crypto");

var base64ToImage = require('base64-to-image');

const app = express()

app.get('/', (req, res) => {
	res.status(200);
	res.send('client is alive');
});


// var firebaseConfig = {
//     apiKey: "LOOOL SIKE",
//     authDomain: "homeless-uofthacks.firebaseapp.com",
//     databaseURL: "https://homeless-uofthacks.firebaseio.com",
//     projectId: "homeless-uofthacks",
//     storageBucket: "homeless-uofthacks.appspot.com",
//     messagingSenderId: "431956862659",
//     appId: "1:431956862659:web:10a829c60b743f54282476"
// };

// firebase.initializeApp(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeless-b67f9.firebaseio.com"
})

let db = admin.firestore();

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/dist/index.html'))
})
const port = 3000;

app.post('/login',upload.single("file"), async function(req, res) {

    var base64Str = req.body.file
    var path ='/Users/zain/hackathon/uoft-hacks/facenet/data/images/temp/temp/';
    var optionalObj = {'fileName': 'new_person', 'type':'jpg'};
    base64ToImage(base64Str,path,optionalObj);

    axios.post( 'http://localhost:5000/check_exist', {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(async function(response){
        if(response.data.uuid.length>0){
            // uuid exist in model
            db.collection('users').get()
            .then((snapshot) => {
                snapshot.forEach(async function(doc){
                    if(doc.id == response.data.uuid) {
                        
                        // exist on db
                        var data = [doc.id, doc.data()];
                        console.log("exists in db");
                        console.log(doc.data());
                        var hash = hashit(JSON.stringify(data));
                        // console.log(hash);
                        // check block chain.

                        var ifExist = await checkChain(hash);
                        if(ifExist) {
                            res.json(doc.data());
                        } else {
                            console.log("user hash not on blockchain.")
                            res.json({"error": "user hash not on blockchain."});
                            return
                        }

                    }
                });
            })
            .catch((err) => {
                console.log('Error getting documents');
                res.json({"error": "user does not exist on database"});
                return
            });
        } else {
            res.json({"error": "user does not exist in model."});
            return
        }
    })
    .catch(function(err){
        console.log("model server did not respond.");
        res.json({"error": "model server did not respond."});
    });
});

app.post('/adduser', upload.single("file"), async function(req, res) {
    
    var base64Str = req.body.file
    var path ='/Users/zain/hackathon/uoft-hacks/facenet/data/images/temp/temp/';
    var optionalObj = {'fileName': 'new_person', 'type':'jpg'};
    
    base64ToImage(base64Str,path,optionalObj); 
    
    // var exist = await axios.post( 'http://localhost:5000/check_exist',
    //         {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     }
    //     ).then(function(response){
    //         // console.log(response);
    //         if(response.data.uuid.length>0) {
    //             console.log("Person already exists please authenticate them.")
    //             res.json({"error": "Person already exists please authenticate them."});
    //             return true;
    //         }
    //     })
    //     .catch(function(err){
    //         console.log("model server did not respond.");
    //         res.json({"error": "model server did not respond."});
    //         return true
    // });

    // if(!exist){
        // base64ToImage(base64Str,path,optionalObj);

    await fetch( 'http://127.0.0.1:5000/add_user' ).then(function(err, response){
            if(err){console.log(err); return}
            if(response.data.uuid.length>0) {
                let aTuringRef = db.collection('users').doc(response.data.uuid);
                // FIX THIS
                var data = {
                    'name': req.body.name,
                    'dob': req.body.dob
                }
                
                aTuringRef.set(data).then(async function() {
                    var id = response.data.uuid;
                    var data = [id, doc.data()]
                    var hash = hashit(JSON.stringify(data));
                    await addToChain(hash);
                    res.json({"message": "User registered successfully."})
                    console.log("user registered successfully")
                })
            }
        })
        .catch(function(err){
            console.log("model server did not respond."+err);
            res.json({"error": "model server did not respond."});
    });
    // }    
})

let abi = [ { "constant": true, "inputs": [ { "internalType": "uint256", "name": "hash", "type": "uint256" } ], "name": "hashExists", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "hash", "type": "uint256" } ], "name": "set", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]

// Connect to the network
let url = "http://100.65.83.200:7545";
let customHttpProvider = new ethers.providers.JsonRpcProvider(url);

// The address from the above deployment example
let contractAddress = "0x699fEaAf930EB85Fb0A9532395F8bEaB4F8aBb7f";

let privateKey = '4202377ab453ee2261e35a478cf3036e40ed0d24818e790d8156110e8407ac96';

let wallet = new ethers.Wallet(privateKey, customHttpProvider);
let myContract = new ethers.Contract(contractAddress, abi, wallet)
// send().then(get());
// get(10);




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

async function addToChain(hash) {
    await myContract.set(hash);
}

async function checkChain(hash) {
    let tx = await myContract.hashExists(hash);
    console.log(tx);
    return tx;
}


async function hashit(data) {
    // var first = parseInt("4410777595478936705512751944337873".substr(0,10));
    // var second = parseInt("1418985490348689193595175156116443938027044".substr(0,10));
    // await addToChain(first)
    // await addToChain(second)
    // console.log(sha256(data))
    var hash = sha256(data);
    mystring = hash.replace(/\D/g,'');
    var first = parseInt("4410777595478936705512751944337873".substr(0,10));
    console.log(first);
    return first;
}