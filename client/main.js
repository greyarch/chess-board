var PIECE_SET = {
    WP: '&#9817', WR: '&#9814', WN: '&#9816', WB: '&#9815', WQ: '&#9813', WK: '&#9812',
    BP: '&#9823', BR: '&#9820', BN: '&#9822', BB: '&#9821', BQ: '&#9819', BK: '&#9818',
};

var EMPTY = '';
var BOARD_COLS = {false:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], true:['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']};
var BOARD_ROWS = {false:['8', '7', '6', '5', '4', '3', '2', '1'], true:['1', '2', '3', '4', '5', '6', '7', '8']};

var createBoard = function() {
    return {messages: [{text: "Game on!", isMove: false}], pieces:
      {A8: PIECE_SET.BR, B8: PIECE_SET.BN, C8: PIECE_SET.BB, D8: PIECE_SET.BQ, E8: PIECE_SET.BK, F8: PIECE_SET.BB, G8: PIECE_SET.BN, H8: PIECE_SET.BR,
          A7: PIECE_SET.BP, B7: PIECE_SET.BP, C7: PIECE_SET.BP, D7: PIECE_SET.BP, E7: PIECE_SET.BP, F7: PIECE_SET.BP, G7: PIECE_SET.BP, H7: PIECE_SET.BP,
          A6: "", B6: "", C6: "", D6: "", E6: "", F6: "", G6: "", H6: "",
          A5: "", B5: "", C5: "", D5: "", E5: "", F5: "", G5: "", H5: "",
          A4: "", B4: "", C4: "", D4: "", E4: "", F4: "", G4: "", H4: "",
          A3: "", B3: "", C3: "", D3: "", E3: "", F3: "", G3: "", H3: "",
          A2: PIECE_SET.WP, B2: PIECE_SET.WP, C2: PIECE_SET.WP, D2: PIECE_SET.WP, E2: PIECE_SET.WP, F2: PIECE_SET.WP, G2: PIECE_SET.WP, H2: PIECE_SET.WP,
          A1: PIECE_SET.WR, B1: PIECE_SET.WN, C1: PIECE_SET.WB, D1: PIECE_SET.WQ, E1: PIECE_SET.WK, F1: PIECE_SET.WB, G1: PIECE_SET.WN, H1: PIECE_SET.WR
      }
    };
};

Session.set('reverse_board', false);

Template.board.helpers({
  game: function() {
    return getCurrentGame();
  },

  boardRows: function() {
    return BOARD_ROWS[Session.get('reverse_board')];
  },

  boardCols: function() {
    return BOARD_COLS[Session.get('reverse_board')];
  },

  render_board: function(pieces) {
      console.log("pieces: ", pieces);
      var boardHtml = '<table id="chess_board" cellpadding="0" cellspacing="0">';
      var reverse = Session.get("reverse_board");
      for (var row in BOARD_ROWS[reverse]) {
          var rowHtml = "<tr>";
          for (var col in BOARD_COLS[reverse]) {
              var pos = BOARD_COLS[reverse][col].toUpperCase() + BOARD_ROWS[reverse][row].toUpperCase();
              var pc = _.isEmpty(pieces) ? '' : pieces[pos.toUpperCase()] || pieces[pos.toLowerCase()];
              var pieceHtml = pc ? '<div class=piece draggable=true title="Drag to move. Ctrl+Click to remove.">' + pc + '</div>' : "";
              rowHtml = rowHtml + '<td class=dropzone id=' + pos + '>' + pieceHtml + '</td>';
          }
          boardHtml = boardHtml + rowHtml + "</tr>";
      }
      return boardHtml + "</table>";
  },

  render_piece: function(piece) {
      return "<div class=offboard_piece draggable=true title='Drag to add to the board.'>" + PIECE_SET[piece.toUpperCase()] + "</div>";
  },
});

Template.board.events({
    'keypress input#message': function(e) {
        if (e.keyCode == '13') {
            var msg = $('input#message');
            if (msg.val()) {
                addMessage(msg.val());
                msg.val("");
            }
        }
    },

    'dragstart [draggable=true]': function(e) {
      e.originalEvent.dataTransfer.setData("source_id", e.target.parentNode.id);
      e.originalEvent.dataTransfer.setData("piece", e.target.innerHTML);
    },

    'dragover .dropzone': function(e) {
      e.preventDefault();
    },

    'drop .dropzone': function(e) {
      var targetId = e.target.id ? e.target.id : e.target.parentNode.id;
      var sourceId = e.originalEvent.dataTransfer.getData("source_id");
      var piece = e.originalEvent.dataTransfer.getData("piece");
      if (sourceId === 'offboard_pieces') {
        putPiece(piece, targetId);
      } else if (sourceId !== targetId) {
        movePiece(sourceId, targetId);
      }
    },

    'click .piece': function(e) {
      var targetId = e.target.id ? e.target.id : e.target.parentNode.id;
      if (e.ctrlKey || e.shiftKey) removePiece(targetId);
    }
});


Template.board.onRendered(function() {
  this.$('#messages').scrollTop($('#messages').height());
  this.$('#message').focus();
});

Template.navigation.events({
  'click button#reset': function() {
    Games.update({_id: getBoardId()}, {$set: createBoard()});
  },
  'click button#rotate': function() {
    Session.set('reverse_board', !Session.get('reverse_board'));
  }
});

Template.start.events({
  'click button#new-board': function(e) {
    var boardId = Games.insert(createBoard());
    FlowRouter.go("/board/" + boardId);
  }
});

Template.navigation.helpers({
  boardId: function() {
    return getBoardId();
  }
});

var getCurrentGame = function() {
    return Games.findOne({_id: getBoardId()});
};

var getBoardId = function() {
    return Session.get('boardId');
};

var addMessage = function(msg) {
    Games.update({_id: getBoardId()}, {$push: {messages: {text: msg, isMove: false}}});
};

var movePiece = function(from, to) {
    var game = getCurrentGame();
    game.pieces[to] = game.pieces[from];
    game.pieces[from] = EMPTY;
    Games.update({_id: getBoardId()}, {$set: {pieces: game.pieces},
        $push: {messages: {text: from + "-" + to, isMove: true}}});
};

var putPiece = function(piece, pos) {
    var game = getCurrentGame();
    game.pieces[pos] = piece;
    Games.update({_id: getBoardId()}, {$set: {pieces: game.pieces},
        $push: {messages: {text: "Put " + piece + " on " + pos, isMove: true}}});
};

var removePiece = function(pos) {
    var game = getCurrentGame();
    game.pieces[pos] = EMPTY;
    Games.update({_id: getBoardId()}, {$set: {pieces: game.pieces},
        $push: {messages: {text: "Removed the piece on " + pos, isMove: true}}});
};
