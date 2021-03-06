/*
 *
 */
jQuery(function($){
  Bowline.trace = true;

  var tweets_ = null;

  var keydown_event_ = {};
  var keyup_event_   = {};

  var mode_ = "friends";

  var current_id_    = 0;
  // key down event
  keydown_event_['j'] = function(e) {
    var now  = get_current();
    var next = now.next();
    var id = next.find('.id');
    if(id && next.hasClass("item")) {
      change_current(next);
    }
    else {
      var now = now.parent().next().children(':first');
      Bowline.log("no next and now's size = " + now.size());
      if(now.size() != 0) {
        change_current(now);
      }
    }
  };
  keydown_event_['k'] = function(e) {
    var now  = get_current();
    var prev = now.prev();
    var id = prev.find('.id');
    if(id && prev.hasClass('item')) {
      change_current(prev);
    }
    else {
      var now = now.parent().prev().children(':last');
      Bowline.log("no next and now's size = " + now.size());
      if(now.size() != 0) {
        change_current(now);
      }
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
  /*
  $(window).click(function(){
      notifyMessage("clicked");
    });
    */
  $(window).mousedown(function(){
      notifyMessage("clicked");
    });

  function event_fire(e , key_def) {
    notifyMessage(String.fromCharCode(e.keyCode).toLowerCase());
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

  tweets_ = $('#tweets');
  tweets_.bowlineBind('TweetsBinder');


  var mentions = $('#mentions');
  mentions.bowlineBind('MentionsBinder');

  $('#btn_home').click(function() {
      mentions.hide();
      $('#friends').show("noraml");
      if(mode_ != 'friends') {
        initialize_friends_area();
        mode_ = "friends"
        tweets_.invoke('poll' , {diff: false});
      }
    });

  $('#btn_reply').click(function() {
      mentions.show("noraml");
      mode_ = "mentions"
      var item = mentions.find(".item:first");
      $('#friends').hide();
    });

  $('img' , $('.control')).mouseover(function(ev) {
      ev.target.style.backgroundColor = "#8ec1da";
    });
  $('img' , $('.control')).mouseout(function(ev) {
      ev.target.style.backgroundColor = "";
    });

  $('#btn_list').click(function() {
      tweets_.invoke('list_names',function(res) {
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
              tweets_.invoke('change_search_word', text.val());
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


  /*

  $('.main').update(function() {
      var h = $(this).attr("scrollHeight");
      if(h == 0) {
        change_current(get_fist_item());
      }
      else {
        $(this).attr({scrollTop : h});
      }
    });
    */

  // ref tweet_base.rb
  $.openURL = function(url) {
    tweets_.invoke('openURL', url);
  }

  $.reply = function(img) {
    openInput("@" + $(img).parent().find(".screen_name").val() + " " , 
      $(img).parent().find('.id').val());
  }

  $.select_list = function(a) {
    var list = a.innerHTML;
    if(list == "close" || mode_ == list) {
      return;
    }
    /*
    $('#friends').show();
    */

    $('#list_area').hide();
    mode_ = list;
    //initialize_friends_area();
    tweets_.invoke('change_list', a.innerHTML);
    $('#btn_home').click();
  }

  $.initialize_tweets = function(count) {
    // no new tweets
    if(count == 0) {
      return;
    }

    tweets_.find(".item").each(function() {
        $(this).attr("id" , $(this).find(".id").val());
      });
    tweets_.addClass("new_tweet_separator");
    tweets_.bowlineUnbind('TweetsBinder');

    var new_tweets = create_tweets();
    new_tweets.insertBefore(tweets_);
    new_tweets.bowlineBind('TweetsBinder');
    tweets_ = new_tweets

    /*
    tweets_.update(function() {
        var t = $('.main').attr('scrollTop');
        $('.main').attr({
            scrollTop : $('.main').attr("scrollHeight")
          });
      });
      */
    change_current(get_fist_item());
    $('.main').attr({scrollTop : 0});
  }

  function create_tweets() {
    var tweets = $(document.createElement('div'));
    tweets.attr("id" , "tweets_" + (new Date().getTime()));
    var item = $(document.createElement('div')).addClass('item');
    item.append($(document.createElement('img'))
      .addClass('profile_image_url')
      .click(function() {
          $.reply(this);
        }));
    item.append($(document.createElement('span'))
      .addClass('formated_text'));
    item.append($(document.createElement('input'))
      .attr('type' , 'hidden')
      .addClass('screen_name'));
    item.append($(document.createElement('input'))
      .attr('type' , 'hidden')
      .addClass('id'));

    tweets.append(item);

    return tweets;
  }
  
  function initialize_friends_area() {
    tweets_.bowlineUnbind('TweetsBinder');
    var new_tweets = create_tweets();
//    $('#friends').html("");
// $('#friends').append(new_tweets);
    new_tweets.insertBefore(tweets_);
    new_tweets.bowlineBind('TweetsBinder');
    new_tweets.nextAll().hide();

    tweets_ = new_tweets
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
    current.addClass('current');
    return current;
  }

  function get_fist_item() {
      return $('#' + mode_).find('.item:first');
  }

  function change_current(item) {
    if(item == null) {
      return;
    }
    $('.current').removeClass('current');
    item.addClass('current');
    window.location = "#" + item.attr('id');
    Bowline.log("change_current : current_id_ is " + current_id_);
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
            tweets_.invoke('update', {
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

  function notifyMessage(msg) {
    $('#message').text(msg);
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

  tweets_.invoke('poll');
  $.friends_timer = setInterval(function() {
      if($('#post_text').css('display') == 'none' || $('#post_text').size() == 0) {
        tweets_.invoke('poll');
      }
    } , 1000 * 30);

  setTimeout(function(){ 
      if($('#post_text').css('display') == 'none' || $('#post_text').size() == 0) {
        mentions.invoke('poll') 
      }
    } , 10000);

  $.mentions_timer = setInterval(function() {
      if($('#post_text').css('display') == 'none' || $('#post_text').size() == 0) {
        mentions.invoke('poll');
      }
    } , 1000 * 60 * 2);
});

function initialize_tweets(count)  {
  $.initialize_tweets(count);
}
