DEFAULT_BOARD = {game: 1, messages: [{text: "Game on!", isMove: false}], pieces: [
        ["20", "22", "21", "19", "18", "21", "22", "20"],
        ["23", "23", "23", "23", "23", "23", "23", "23"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["17", "17", "17", "17", "17", "17", "17", "17"],
        ["14", "16", "15", "13", "12", "15", "16", "14"]
    ]};
Games = new Meteor.Collection("games");

if (Meteor.isClient) {
    Template.board.game = function() {
        return Games.findOne({game: 1});
    };

    Template.board.events = {
        'keypress input#message': function(e) {
            if (e.charCode == '13') {
                var msg = $('input#message').val();
                var game = Games.findOne({game: 1});
                var messages = game.messages;
                if (m = msg.match(/^([abcdefgh])([12345678])-([abcdefgh])([12345678])$/i)) {
                    var newSet = move(game.pieces, m);
                    messages.push({text: msg, isMove: true});
                    Games.update({game: 1}, {$set: {pieces: newSet, messages: messages}});
                } else {
                    messages.push({text: msg, isMove: false});
                    Games.update({game: 1}, {$set: {messages: messages}});
                }
                $('input#message').val("");
            }
        }
    };

    Template.navigation.events = {
        'click button#reset': function() {
            Games.update({game: 1}, {$set: DEFAULT_BOARD});
        }
    };

    move = function(pieces, m) {
        console.log("move", m);
        var pc = pieces[8 - m[2]][m[1].toLowerCase().charCodeAt(0) - 97];
        pieces[8 - m[2]][m[1].toLowerCase().charCodeAt(0) - 97] = "";
        pieces[8 - m[4]][m[3].toLowerCase().charCodeAt(0) - 97] = pc;
        return pieces;
    }
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Games.find({}).count() == 0) {
            Games.insert(DEFAULT_BOARD);
        }
    });
}
