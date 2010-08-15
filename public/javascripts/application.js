// TODO
// □ id の二重持ちをしない。tweet かの判定は .item で判断する。
//
jQuery(function($){
  Bowline.trace = true;

  var keydown_event_ = {};
  var keyup_event_   = {};

  // key down event
  keydown_event_['j'] = function(e) {
    var now  = $('.current');
    var next = now.next();
    var id = next.attr("id");
    if(id != null && id.indexOf("tweet_") == 0) {
      next.addClass('current');
      now.removeClass('current');
      window.location = "#" + id
      $.current = id;
    }
    else {
      var now  = $('.current');
      Bowline.log("no next and now's size = " + now.size());
      window.location = "#" + id
      $.current = id;
    }
  };
  keydown_event_['k'] = function(e) {
    var now  = $('.current');
    var prev = now.prev();
    var id = prev.attr("id");
    if(id && prev.attr("id").indexOf("tweet_") == 0) {
      prev.addClass('current');
      now.removeClass('current');
      window.location = "#" + prev.attr("id");
      $.current = prev.attr("id");
    }
  };
  keydown_event_['o'] = function(e) {
    var a = $('.current').find("a");
    if(a.size() != 0) {
      a.click();
    }
  };
  keydown_event_['m'] = function(e) {
    $('#btn_reply').click();
  };
  keydown_event_['f'] = function(e) {
    $('#btn_home').click();
  };
  keydown_event_['u'] = function(e) {
    $.openURL('http://twitter.com/' + $('.current').find(".screen_name").val());
  };
  keydown_event_['l'] = function(e) {
    $('#btn_list').click();
  };

  // key up event
  keyup_event_['r'] = function(e) {
    var current = $('.current')
    var text = "@" + current.find(".screen_name").val() + " ";
    var id   = current.find('.id').val();
    openInput(text , id);
  };
  keyup_event_['c'] = function(e) {
    openInput("");
  }

  $.current = null;

  $(window).keydown(function(e){ event_fire(e , keydown_event_) });
  $(window).keyup(  function(e){ event_fire(e , keyup_event_  ) });

  function event_fire(e , key_def) {
    var tag = e.target.tagName;
    if(tag == "INPUT" || tag == "TEXTAREA") {
      return;
    }
    var key = String.fromCharCode(e.keyCode).toLowerCase();
    var tag = e.target.tagName;
    if(tag == "INPUT" || tag == "TEXTAREA") {
      return;
    }
    var func = key_def[key];
    if(func != null) {
      func(e);
    }
  }

  $("#tweets").update(function() {
      $(this).attr({
          scrollTop : $(this).attr("scrollHeight")
        });
    });

  var tweets = $('#tweets');
  tweets.bowlineBind('TweetsBinder');

  var mentions = $('#mentions');
  mentions.bowlineBind('MentionsBinder');

  /*
  $('#updateText').keydown(function(e) {
      if(e.keyCode != 13) {
        return;
      }
      tweets.invoke('update', $('#updateText').val());
      $('#updateText').val('');
      return false;
    });
    */

  $('#btn_home').click(function() {
      tweets.show("noraml");
      mentions.hide();
    });

  $('#btn_reply').click(function() {
      mentions.show("noraml");
      var item = mentions.find(".item:first");
      item.addClass('.current');
      $.current = item.attr("id");
      tweets.hide();
    });

  $('img' , $('.control')).mouseover(function(ev) {
      ev.target.style.backgroundColor = "#8ec1da";
    });
  $('img' , $('.control')).mouseout(function(ev) {
      ev.target.style.backgroundColor = "";
    });

  $('#btn_list').click(function() {
      tweets.invoke('list_names',function(res) {
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

  // ref tweet_base.rb
  $.openURL = function(url) {
    $('#tweets').invoke('openURL', url);
  }

  $.reply = function(img) {
    openInput("@" + $(img).parent().find(".screen_name").val() + " ");
  }

  $.select_list = function(a) {
    var list = a.innerHTML;
    if(list != "close") {
      setTimeout(function(){tweets.invoke('change_list', a.innerHTML)}, 100);
    }
    $('#list_area').hide();
    $('#btn_home').click();
  }

  $.initialize_tweets = function(id) {
    $("#tweets").find(".item").each(function() {
        var tweet_id = $(this).find(".id").val();
        if(tweet_id > id) {
          $(this).addClass("new_tweet");
        }
        else if(tweet_id == id) {
          $(this).addClass("new_tweet_separator");
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

  function set_current(item) {
    $('.current').removeClass('current');
    item.addClass('.current');
    $.current = item.attr('id');
  }

  function jumpCurrent() {
    window.location = "#" + $.current;
  }

  function openInput(msg , in_reply_to) {
    var text = $('#post_text');
    if(text.size() == 0) {
      text = $(document.createElement('textarea'));
      text.attr("id" , "post_text");
      // post event
      text.keydown(function(e) {
          // enter
          if(e.keyCode == 13 && e.ctrlKey) {
            $(this).attr("disabled" , "disabled");
            var text = $("#post_text");
            tweets.invoke('update', {
                status      : text.val() , 
                in_reply_to : $(this).attr('in_reply_to')
              });
            text.val('');
            text.hide();
            text.blur();
          }
          // esc
          else if(e.keyCode == 27) {
            $(this).hide();
            $(this).blur();
            jumpCurrent();
          }
        });
      // hide on blur
      text.blur(function() {
          $(this).attr("in_reply_to" , "");
          $(this).hide();
        });
      $('body').append(text);
    }
    text.attr("disabled" , "");
    text.attr("in_reply_to" , in_reply_to);
    text.show();
    text.focus();
    if(typeof(msg) == "string") {
      text.val(msg);
    }
  }
});

function initialize_tweets(id)  {
  $.initialize_tweets(id);
}
