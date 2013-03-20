var PIECE_SET = {
    WP: "17", WR: "14", WN: "16", WB: "15", WQ: "13", WK: "12",
    BP: "23", BR: "20", BN: "22", BB: "21", BQ: "19", BK: "18",
    EMPTY: ""
}

createBoard = function() {
    return {messages: [{text: "Game on!", isMove: false}], pieces: [
            [PIECE_SET.BR, PIECE_SET.BN, PIECE_SET.BB, PIECE_SET.BQ, PIECE_SET.BK, PIECE_SET.BB, PIECE_SET.BN, PIECE_SET.BR],
            [PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            [PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP],
            [PIECE_SET.WR, PIECE_SET.WN, PIECE_SET.WB, PIECE_SET.WQ, PIECE_SET.WK, PIECE_SET.WB, PIECE_SET.WN, PIECE_SET.WR]
        ]};
};

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
                    move(game.pieces, m);
                    messages.push({text: msg, isMove: true});
                } else if(m = msg.match(/^([w|b][p|r|n|b|q|k]|empty)@([abcdefgh])([12345678])$/i)) {
                    setPieceAt(game.pieces, m[2], m[3], PIECE_SET[m[1].toUpperCase()]);
                    messages.push({text: msg, isMove: true});
                } else {
                    messages.push({text: msg, isMove: false});
                }
                Games.update({_id: Session.get('boardId')}, {$set: {pieces: game.pieces, messages: messages}});
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
        var pc = getPieceAt(pieces, m[1], m[2]);
        setPieceAt(pieces, m[1], m[2], "");
        setPieceAt(pieces, m[3], m[4], pc);
        return pieces;
    };

    getPieceAt = function(pieces, col, row) {
        return pieces[8 - row][col.toLowerCase().charCodeAt(0) - 97];
    };

    setPieceAt = function(pieces, col, row, pc) {
        pieces[8 - row][col.toLowerCase().charCodeAt(0) - 97] = pc;
    };
}