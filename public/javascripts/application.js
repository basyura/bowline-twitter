jQuery(function($){
  Bowline.trace = true;

  $.current = null;

  $(window).keydown(function(e){
      var tag = e.target.tagName;
      if(tag == "INPUT" || tag == "TEXTAREA") {
        return;
      }
      if(e.keyCode == 74) {
        try {
        var now  = $('.current');
        var next = now.next();
        var id = next.attr("id");
        if(id != null && id.indexOf("tweet_") == 0) {
          next.addClass('current');
          now.removeClass('current');
          window.location = "#" + id
          $.current = id;
        }
      } catch(e) {
        alert(e.message + "_ " + id);
      }
      }
      else if(e.keyCode == 75) {
        var now  = $('.current');
        var prev = now.prev();
        var id = prev.attr("id");
        if(id && prev.attr("id").indexOf("tweet_") == 0) {
          prev.addClass('current');
          now.removeClass('current');
          window.location = "#" + prev.attr("id");
          $.current = prev.attr("id");
        }
      }
    });

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

  $('#btn_home').click(function() {
      tweets.show("noraml");
      mentions.hide();
    });

  $('#btn_reply').click(function() {
      mentions.show("noraml");
      tweets.hide();
    });

  $('img' , $('.control')).mouseover(function(ev){
      ev.target.style.backgroundColor = "#8ec1da";
    });
  $('img' , $('.control')).mouseout(function(ev){
      ev.target.style.backgroundColor = "";
    });

  $('#btn_list').click(function(){
      tweets.invoke('list_names',function(res){
          var list = $('#list_area');
          if(list.size() == 0) {
            list = $(document.createElement('div'));
            list.attr("id" , "list_area");
            list.css({position : "absolute" , top : "0"});
            $('body').append(list);
            list.append(
              $("<div class='list_area_close'>" + 
                  "<a href='javascript:void(0)' onclick='$.select_list(this)' >" +
                   "close</a><div>"));
            list.append(
              $("<div><a href='javascript:void(0)' onclick='$.select_list(this)' >" +
                   "friends</a><div>"));
            for(var i = 0 ; i < res.length ; i++) {
              list.append(
                $("<div><a href='javascript:void(0)' onclick='$.select_list(this)' >" + 
                    res[i] + "</a><div>"));
            }
          }
          list.show("slow");
        });
    });

  $('#btn_post').click(openInput);

  $.openURL = function(url) {
    $('#tweets').invoke('openURL', url);
  }

  $.reply = function(img) {
    openInput("@" + $(img).parent().find(".screen_name").val() + " ");
  }

  $.select_list = function(a) {
    var list = a.innerHTML;
    if(list != "close") {
      tweets.invoke('change_list', a.innerHTML);
    }
    $('#list_area').hide();
  }

  $.initialize_tweets = function(id) {
    $("#tweets").find(".item").each(function(){
        var tweet_id = $(this).find(".id").val();
        if(tweet_id > id) {
          $(this).find("img").css("border" , "3px double orange");
        }
        $(this).attr("id" , "tweet_" + tweet_id);
      });
    // set current
    var current = null;
    // forcely focus first tweet
    if($(".main").scrollTop() == 0) {
      current = $("#tweets").find(".item:first");
    }
    else {
      if($.current != null) {
        current = $("#" + $.current);
      }
      if(current == null || current.size() == 0) {
        current = $("#tweets").find(".item:first");
      }
    }
    current.addClass("current");
    $.current = current.attr("id");
 
    window.location = "#" + $.current;
  }


  function openInput(msg) {
    var text = $('#post_text');
    if(text.size() == 0) {
      text = $(document.createElement('textarea'));
      text.attr("id" , "post_text");
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
    text.show("normal");
    text.focus();
    if(typeof(msg) == "string") {
      text.val(msg);
    }
  }
});

function initialize_tweets(id)  {
  $.initialize_tweets(id);
}
