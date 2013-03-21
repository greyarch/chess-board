var PIECE_SET = {
    WP: "17", WR: "14", WN: "16", WB: "15", WQ: "13", WK: "12",
    BP: "23", BR: "20", BN: "22", BB: "21", BQ: "19", BK: "18",
    EMPTY: ""
}

createBoard = function() {
    return {messages: [{text: "Game on!", isMove: false}], pieces: [
<<<<<<< HEAD
            [{value:"20", location:"a8"}, {value:"22", location:"b8"}, {value:"21", location:"c8"}, {value:"19", location:"d8"}, {value:"18", location:"e8"}, {value:"21", location:"f8"}, {value:"22", location:"g8"}, {value:"20", location:"h8"}],
            [{value:"23", location:"a7"}, {value:"23", location:"b7"}, {value:"23", location:"c7"}, {value:"23", location:"d7"}, {value:"23", location:"e7"}, {value:"23", location:"f7"}, {value:"23", location:"g7"}, {value:"23", location:"h7"}],
            [{value:"", location:"a6"}, {value:"", location:"b6"}, {value:"", location:"c6"}, {value:"", location:"d6"}, {value:"", location:"e6"}, {value:"", location:"f6"}, {value:"", location:"g6"}, {value:"", location:"h6"}],
            [{value:"", location:"a5"}, {value:"", location:"b5"}, {value:"", location:"c5"}, {value:"", location:"d5"}, {value:"", location:"e5"}, {value:"", location:"f5"}, {value:"", location:"g5"}, {value:"", location:"h5"}],
            [{value:"", location:"a4"}, {value:"", location:"b4"}, {value:"", location:"c4"}, {value:"", location:"d4"}, {value:"", location:"e4"}, {value:"", location:"f4"}, {value:"", location:"g4"}, {value:"", location:"h4"}],
            [{value:"", location:"a3"}, {value:"", location:"b3"}, {value:"", location:"c3"}, {value:"", location:"d3"}, {value:"", location:"e3"}, {value:"", location:"f3"}, {value:"", location:"g3"}, {value:"", location:"h3"}],
            [{value:"17", location:"a2"}, {value:"17", location:"b2"}, {value:"17", location:"c2"}, {value:"17", location:"d2"}, {value:"17", location:"e2"}, {value:"17", location:"f2"}, {value:"17", location:"g2"}, {value:"17", location:"h2"}],
            [{value:"14", location:"a1"}, {value:"16", location:"b1"}, {value:"15", location:"c1"}, {value:"13", location:"d1"}, {value:"12", location:"e1"}, {value:"15", location:"f1"}, {value:"16", location:"g1"}, {value:"14", location:"h1"}]
=======
            [PIECE_SET.BR, PIECE_SET.BN, PIECE_SET.BB, PIECE_SET.BQ, PIECE_SET.BK, PIECE_SET.BB, PIECE_SET.BN, PIECE_SET.BR],
            [PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP, PIECE_SET.BP],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            [PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP, PIECE_SET.WP],
            [PIECE_SET.WR, PIECE_SET.WN, PIECE_SET.WB, PIECE_SET.WQ, PIECE_SET.WK, PIECE_SET.WB, PIECE_SET.WN, PIECE_SET.WR]
>>>>>>> 601f93129ee8a14c6418142a3ed6d4d5bb57777c
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
<<<<<<< HEAD
 
=======

>>>>>>> 601f93129ee8a14c6418142a3ed6d4d5bb57777c
    Template.board.events = {
        'keypress input#message': function(e) {
            if (e.charCode == '13') {
                var msg = $('input#message').val();
<<<<<<< HEAD
                boardMove(msg);
=======
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
>>>>>>> 601f93129ee8a14c6418142a3ed6d4d5bb57777c
                $('input#message').val("");
            }
        },
		'dragstart div.piece': function(e) {
			var parentId = e.target.parentNode.id;
			console.log("drag: " + parentId, e);
			e.dataTransfer.setData("Text", parentId);
		},
		'dragover .dropzone': function(e) {
			e.preventDefault(); // prevent default behavior
		},
		'drop .dropzone': function(e) {
			var targetId = e.target.id;
			var sourceId = e.dataTransfer.getData("Text");
			console.log("drop: " + targetId, e);
            boardMove(sourceId+"-"+targetId);
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
    
    boardMove = function(msg) {
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
	}

    move = function(pieces, m) {
        console.log("move", m);
        var pc = getPieceAt(pieces, m[1], m[2]);
        setPieceAt(pieces, m[1], m[2], "");
        setPieceAt(pieces, m[3], m[4], pc);
        return pieces;
<<<<<<< HEAD
    }
}
=======
    };

    getPieceAt = function(pieces, col, row) {
        return pieces[8 - row][col.toLowerCase().charCodeAt(0) - 97];
    };

    setPieceAt = function(pieces, col, row, pc) {
        pieces[8 - row][col.toLowerCase().charCodeAt(0) - 97] = pc;
    };
}
>>>>>>> 601f93129ee8a14c6418142a3ed6d4d5bb57777c
