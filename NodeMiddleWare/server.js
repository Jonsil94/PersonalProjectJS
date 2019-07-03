// Server 2
var osc = require('node-osc');
var o2x = require('object-to-xml');
var syllable = require('syllable');

var message = []; 
var client = new osc.Client('127.0.0.1', 3333);
var clientHaiku = new osc.Client('127.0.0.1', 3000);

var rawHaiku = [];
// var io = require('socket.io').listen(8100);

var io = require('socket.io-client');

var socket = io.connect('https://quiet-lake-23602.herokuapp.com/',  {
    reconnection: true
});

socket.on('connect', function () {
    console.log('connected to http://192.168.1.110:8100/');
    
    socket.emit('ServerConnect','PleaseConnectMe');

    socket.on('clientEvent', function (data) {
    //console.log(data[0].message);

    rawHaiku = rawHaiku.concat(data[0].message);
    rawHaiku = rawHaiku.join(' ');
    rawHaiku = rawHaiku.split(' ');
    
    rawHaiku = rawHaiku.filter(Boolean)

    //checkHowManyWords(rawHaiku);


    if(data[0].message == false){
     	data[0].message  = "blank";
    }

    message.push(data);
   
    

    client.send('/x', o2x({'?xml version="1.0" encoding="utf-8"?' : null,message}), function () {});     

    });
});



function sendHaiku() {
    
   var length = rawHaiku.length;
 
    if(length>=300){
        var newHaiku = rawHaiku.join(' '); 
        var haiku = Haiku(newHaiku);   

        haiku = haiku.toLowerCase();

        clientHaiku.send('/x', o2x({'?xml version="1.0" encoding="utf-8"?' : null,haiku}), function () {});  
    }
    else{
        
    }

}


setInterval(sendHaiku, 15000);







//rawHaiku = rawHaiku.toString();





////////////////////////////////CREATES Haikus//////////////////////////////////////////////////

function checkIfStringExistInList(Things) {
    var stringList = []
    for (var i = Things.length - 1; i >= 0; i--) {
    //console.log(Things[i]+ " " +syllable(Things[i]) );
    
    var word = Things[i];
        if(stringList.indexOf(word.toLowerCase()) > - 1 === false){ 
            stringList.push(word);
        };
    }
    return stringList;
}

function syllableCounter(Things) {
    var data = [];
    for (var i = Things.length - 1; i >= 0; i--) {
    //console.log(Things[i]+ " " +syllable(Things[i]) );
    
    var syllableLength = syllable(Things[i]);
    var word = Things[i];

    data.push({syllableLength:syllableLength,word:word});
    
    }
    return data;
}


function createSentences(data, syllableCount) {
    var count = 0;
    var sentence = [];
    

    while(count<syllableCount){
        var random = getRandomInt(data.length);
        var syllableLengthWord = data[random].syllableLength;
        var word = data[random].word;
        count += data[random].syllableLength;
        sentence.push(word);
        if(count == syllableCount){
            break;
        }
        else{
            continue;
        }
    }


    return sentence;

}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}




function Haiku(rawList) {

    var str = rawList;
    var split = str.split(" ");

    var stringList = checkIfStringExistInList(split);
    var data = syllableCounter(stringList);

    var sentence1 = createSentences(data,5);
    var space = [' | '];
    var sentence2 = createSentences(data,7);
    var sentence3 = createSentences(data,5);

    var haiku = sentence1.concat(space,sentence2,space,sentence3);

    haiku = haiku.join(' ');

    return haiku;

}
