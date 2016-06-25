FlowRouter.route('/', {
  action: function(params, queryParams) {
    BlazeLayout.render("mainLayout", {content: "start", header: "navigation"});
  }
});

FlowRouter.route('/board/:id', {
  action: function(params, queryParams) {
    console.log("board id is", params.id);
    Session.set('boardId', params.id);
    BlazeLayout.render("mainLayout", {content: "board", header: "navigation"});
  }
});
