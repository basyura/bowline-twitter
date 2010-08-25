/*
 *
 */
jQuery(function($){
  Bowline.trace = true;

  var keydown_event_ = {};
  var keyup_event_   = {};

  var mode_ = "tweets";

  var current_id_    = 0;
  // key down event
  keydown_event_['j'] = function(e) {
    var now  = get_current();
    var next = now.next();
    var id = next.attr("id");
    if(id && next.hasClass("item")) {
      change_current(next);
      jumpCurrent();
    }
    else {
      Bowline.log("no next and now's size = " + now.size());
      var now  = get_current();
      change_current(now);
      jumpCurrent();
    }
  };
  keydown_event_['k'] = function(e) {
    var now  = get_current();
    var prev = now.prev();
    var id = prev.attr("id");
    if(id && prev.hasClass('item')) {
      change_current(prev);
      jumpCurrent();
    }
  };
  keydown_event_['o'] = function(e) {
    var a = get_current().find("a");
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
    var current = get_current();
    var text = "@" + current.find(".screen_name").val() + " ";
    var id   = current.find('.id').val();
    openInput(text , id);
  };
  keyup_event_['c'] = function(e) {
    openInput(-1);
  }
  keyup_event_['s'] = function(e) {
    $('#btn_search').click();
  };


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

  $('#btn_home').click(function() {
      tweets.show("noraml");
      mode_ = "tweets"
      mentions.hide();
    });

  $('#btn_reply').click(function() {
      mentions.show("noraml");
      mode_ = "mentions"
      var item = mentions.find(".item:first");
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
                   "friends_timeline</a><div>"));
            for(var i = 0 ; i < res.length ; i++) {
              list.append(
                $("<div><a href='javascript:void(0)' onclick='$.select_list(this)' >" + 
                    res[i] + "</a><div>"));
            }
          }
          list.show("slow");
        });
    });

  $('#btn_search').click(function() {
      var search_area = $('#search_area');
      if(search_area.size() == 0) {
        search_area = $(document.createElement('div'));
        search_area.attr("id" , "search_area");
        var text = $(document.createElement('input'));
        text.keydown(function(e){
            // enter
            if(e.keyCode == 13 && e.ctrlKey) {
              tweets.invoke('change_search_word', text.val());
              text.val('');
              text.parent().hide();
              text.blur();
            }
            // esc
            else if(e.keyCode == 27) {
              $(this).parent().hide();
              $(this).blur();
            }
          });
        var label = $(document.createElement('span'));
        label.text('search ');

        search_area.append(label);
        search_area.append(text);
        $('body').append(search_area);
      }
      search_area.show();
      search_area.find('input:first').focus();
    });
  
  $('#btn_post').click(openInput);

  // ref tweet_base.rb
  $.openURL = function(url) {
    $('#tweets').invoke('openURL', url);
  }

  $.reply = function(img) {
    openInput("@" + $(img).parent().find(".screen_name").val() + " " , 
      $(img).parent().find('.id').val());
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
        $(this).attr("id" , tweet_id);
      });
    // set current
    var current = null;
    // forcely focus first tweet
    if($(".main").scrollTop() == 0) {
      current = $("#tweets").find(".item:first");
    }
    else {
      current = get_current();
      if(current == null || current.size() == 0) {
        current = $("#tweets").find(".item:first");
      }
    }
    change_current(current);
    jumpCurrent();
  }

  function get_current() {
    Bowline.log("current is " + current_id_);
    var current = null;
    if(current_id_ != null && current_id_ != "") {
      current = $('#' + current_id_);
    }
    if(current == null || current.size() == 0) {
      current = $('.current');
    }
    if(current == null || current.size() == 0) {
      current = $('#' + mode_).find('.item:first');
    }
    return current;
  }

  function change_current(item) {
    if(item == null) {
      return;
    }
    $('.current').removeClass('current');
    item.addClass('current');
    current_id_ = item.attr('id');
  }

  function jumpCurrent() {
    window.location = "#" + current_id_;
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

  // login check
  var counter = 0;
  while(true) {
    var islogin = false;
    try {
    Bowline.invoke('AuthenticateBinder' , 'authenticate' , function(ret) {
        islogin = ret;
        if(!islogin) {
          var pin = prompt("Enter PIN:");
          if(pin == null) {
            counter = 5;
          }
          Bowline.invoke('AuthenticateBinder' , 'authenticate_pin' , pin , function(ret) {
              islogin = ret;
            });
        }
      });
  } catch(e) {
    alert(e.message);
  }
    if(islogin) {
      break;
    }
    counter ++;
    if(counter > 5) {
      alert("UnAuthorized")
      return;
    }
  }

  tweets.invoke('poll');
  $.friends_timer = setInterval(function() {
      tweets.invoke('poll');
    } , 1000 * 30);

  setTimeout(function(){ 
      mentions.invoke('poll') 
    } , 10000);
  $.mentions_timer = setInterval(function() {
      mentions.invoke('poll');
    } , 1000 * 60);
});

function initialize_tweets(id)  {
  $.initialize_tweets(id);
}
