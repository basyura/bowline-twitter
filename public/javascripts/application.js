jQuery(function($){
  Bowline.trace = true;

  $("#tweets").update(function(){
      $(this).attr({
          scrollTop: $(this).attr("scrollHeight")
        });
    });

  var tweets = $('#tweets');
  tweets.bowlineBind('TweetsBinder');

  $('#updateText').keydown(function(e){
      if(e.keyCode != 13) {
        return;
      }
      tweets.invoke('update', $('#updateText').val());
      $('#updateText').val('');
      return false;
    });

  $('#friends').click(function() {
      tweets.invoke('friends');
    });

  $('#mentions').click(function() {
      tweets.invoke('mentions');
    });
});
