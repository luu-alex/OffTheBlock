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

var base64ToImage = require('base64-to-image');

const app = express()

app.get('/', (req, res) => {
	res.status(200);
	res.send('client is alive');
});


var firebaseConfig = {
    apiKey: "LOOOL SIKE",
    authDomain: "homeless-uofthacks.firebaseapp.com",
    databaseURL: "https://homeless-uofthacks.firebaseio.com",
    projectId: "homeless-uofthacks",
    storageBucket: "homeless-uofthacks.appspot.com",
    messagingSenderId: "431956862659",
    appId: "1:431956862659:web:10a829c60b743f54282476"
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeless-uofthacks.firebaseio.com"
})

let db = admin.firestore();

// async function getUser(userId) {
//     try {
        
//         // return await db.ref('/users/' + userId).once('value');
//     } catch (error) {
//         return {"error": error}
//     }
// }

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/dist/index.html'))
})
const port = 3000;

app.get('/getuser/:id', async function(req, res) {
    var userId = req.params.id;
    db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.id == userId) {
                    console.log(doc.id, '=>', doc.data());
                    
                    res.json(doc.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    // "wOEE0F748791Pd2xlJzh"
    // await getUser(req.params.id).then((data) => {console.log(data); res.json(data)})
});

app.post('/adduser', upload.single("file"), async function(req, res) {
    console.log("hitting add user")
    
    
    var base64Str = req.body.file.substring(0,req.body.file.length)
    var path ='/Users/zain/hackathon/uoft-hacks/facenet/data/images/temp/temp/';
    var optionalObj = {'fileName': 'new_person', 'type':'jpg'};

    base64ToImage(base64Str,path,optionalObj); 

    // fs.readFile('./uploads/image.jpg', function(err, data) {
    //     if(data){
    //         let formData = new FormData();
    //         formData.append('file', data);


    //     }
    // });

            axios.post( 'http://100.64.219.218:5000/check_exist',
                  {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
                }
              ).then(function(res){
                  console.log(res);
                })
                .catch(function(err){
                  console.log(err);
                });


    

    let aTuringRef = db.collection('users').doc('022975ee-3a72-11ea-ac19-a45e60ea27e7');

    await aTuringRef.set({
        'name': 'Alan',
        'dob': '10-12-1971'
    }).then(res.json({"message": "user added"}))

    
})

let abi = [ { "constant": true, "inputs": [ { "internalType": "uint256", "name": "hash", "type": "uint256" } ], "name": "hashExists", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "hash", "type": "uint256" } ], "name": "set", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]

// Connect to the network
let url = "http://100.65.202.144:7545";
let customHttpProvider = new ethers.providers.JsonRpcProvider(url);

// The address from the above deployment example
let contractAddress = "0x699fEaAf930EB85Fb0A9532395F8bEaB4F8aBb7f";

let privateKey = '4202377ab453ee2261e35a478cf3036e40ed0d24818e790d8156110e8407ac96';

let wallet = new ethers.Wallet(privateKey, customHttpProvider);
let myContract = new ethers.Contract(contractAddress, abi, wallet)
// send().then(get());
get(10);




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

async function send() {
    await myContract.set("789");
}

async function get(hash) {
    let tx = await myContract.hashExists(hash);
    console.log(tx);
    // let blockHash = "0xd963ab8df11738290e71b34e37a76a418411d351d8a4ae51c2a4a48b2b8d1949";
    // customHttpProvider.getBlock(blockHash).then((block) => {
    //     console.log(block);
    // });
}

