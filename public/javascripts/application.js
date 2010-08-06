jQuery(function($){
  Bowline.trace = true;

  $("#tweets").update(function(){
      $(this).attr({
          scrollTop: $(this).attr("scrollHeight")
        });
    });

  var tweets = $('#tweets');
  tweets.bowlineBind('TweetsBinder');

  var mentions = $('#mentions');
  mentions.bowlineBind('MentionsBinder');

  $('#updateText').keydown(function(e){
      if(e.keyCode != 13) {
        return;
      }
      tweets.invoke('update', $('#updateText').val());
      $('#updateText').val('');
      return false;
    });

  $('#btn_friends').click(function() {
      //tweets.invoke('friends');
      tweets.show();
      mentions.hide();
    });

  $('#btn_mentions').click(function() {
      //tweets.invoke('mentions');
      mentions.show();
      tweets.hide();
    });
});
