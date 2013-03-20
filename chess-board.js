createBoard = function() {
    return {messages: [{text: "Game on!", isMove: false}], pieces: [
            ["20", "22", "21", "19", "18", "21", "22", "20"],
            ["23", "23", "23", "23", "23", "23", "23", "23"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["17", "17", "17", "17", "17", "17", "17", "17"],
            ["14", "16", "15", "13", "12", "15", "16", "14"]
        ]};
}

Games = new Meteor.Collection("games");
if (Meteor.isClient) {
    Meteor.Router.add({
        '/': 'start',
        '/board/:id': function(id) {
            console.log("board id is", id);
            Session.set('boardId', id);
            return 'board';
        },
        '*': 'not_found'
    });

    Template.board.game = function() {
        return Games.findOne({_id: Session.get('boardId')});
    };
    Template.board.events = {
        'keypress input#message': function(e) {
            if (e.charCode == '13') {
                var msg = $('input#message').val();
                var game = Games.findOne({_id: Session.get('boardId')});
                var messages = game.messages;
                if (m = msg.match(/^([abcdefgh])([12345678])-([abcdefgh])([12345678])$/i)) {
                    var newSet = move(game.pieces, m);
                    messages.push({text: msg, isMove: true});
                    Games.update({_id: Session.get('boardId')}, {$set: {pieces: newSet, messages: messages}});
                } else {
                    messages.push({text: msg, isMove: false});
                    Games.update({_id: Session.get('boardId')}, {$set: {messages: messages}});
                }
                $('input#message').val("");
            }
        }
    };

    Template.navigation.events = {
        'click button#reset': function() {
            Games.update({_id: Session.get('boardId')}, {$set: createBoard()});
        },
        'click button#new-board': function(e) {
            var boardId = Games.insert(createBoard());
            Meteor.Router.to("/board/" + boardId);
        }
    };

    Template.navigation.onBoard = function() {
        return Session.get('boardId');
    };

    move = function(pieces, m) {
        console.log("move", m);
        var pc = pieces[8 - m[2]][m[1].toLowerCase().charCodeAt(0) - 97];
        pieces[8 - m[2]][m[1].toLowerCase().charCodeAt(0) - 97] = "";
        pieces[8 - m[4]][m[3].toLowerCase().charCodeAt(0) - 97] = pc;
        return pieces;
    }
}