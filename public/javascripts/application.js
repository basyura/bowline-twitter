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

  $('#dock_home').click(function() {
      tweets.show();
      mentions.hide();
    });

  $('#dock_mentions').click(function() {
      mentions.show();
      tweets.hide();
    });

  $('#dock_post').click(function() {
      var text = $('#post_text');
      if(text.size() == 0) {
        text = $(document.createElement('textarea'));
        text.attr("id" , "post_text");
        text.css({
            "position":"absolute",
            "top"     :"0",
            "width"   :"97%",
            "height"  :"40px",
          });
        // post event
        text.keydown(function(e) {
            // enter
            if(e.keyCode == 13 && e.ctrlKey) {
              $(this).attr("disabled" , "disabled");
              setTimeout(function() {
                  var text = $("#post_text");
                  tweets.invoke('update', text.val());
                  text.val('');
                  text.hide();
                },100);
            }
            // esc
            else if(e.keyCode == 27) {
              $(this).hide();
            }
          });
        // hide on blur
        text.blur(function() {
            $(this).hide();
          });
        $('body').append(text);
      }
      text.attr("disabled" , "");
      text.show();
      text.focus();
    });


  $('#dock').Fisheye(
    {
      maxWidth: 30,
      items: 'a',
      itemsText: 'span',
      container: '.dock-container',
      itemWidth: 30,
      proximity: 90,
      halign : 'center'
    }
  )
});
