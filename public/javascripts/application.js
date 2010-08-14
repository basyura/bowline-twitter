jQuery(function($){
  Bowline.trace = true;

  $.current = null;

  $(window).keydown(function(e){
      Bowline.log("keyCode = " + e.keyCode);
      var tag = e.target.tagName;
      if(tag == "INPUT" || tag == "TEXTAREA") {
        return;
      }
      // j
      if(e.keyCode == 74) {
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
      }
      // k
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
      // o
      else if(e.keyCode == 79) {
        var a = $('.current').find("a");
        if(a.size() != 0) {
          a.click();
        }
      }
      // m
      else if(e.keyCode == 77) {
        $('#btn_reply').click();
      }
      // f
      else if(e.keyCode == 70) {
        $('#btn_home').click();
      }
      // u
      else if(e.keyCode == 85) {
        $.openURL('http://twitter.com/' + $('.current').find(".screen_name").val());
      }
      // l
      else if(e.keyCode == 76) {
        $('#btn_list').click();
      }
    });

  $(window).keyup(function(e){
      var tag = e.target.tagName;
      if(tag == "INPUT" || tag == "TEXTAREA") {
        return;
      }
      // r
      if(e.keyCode == 82) {
        openInput("@" + $('.current').find(".screen_name").val() + " ");
      }
      // c
      if(e.keyCode == 67) {
        openInput("");
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
      var item = mentions.find(".item:first");
      item.addClass('.current');
      $.current = item.attr("id");
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
      setTimeout(function(){tweets.invoke('change_list', a.innerHTML)}, 100);
    }
    $('#list_area').hide();
    $('#btn_home').click();
  }

  $.initialize_tweets = function(id) {
    $("#tweets").find(".item").each(function(){
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
            $(this).blur();
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
            $(this).blur();
            jumpCurrent();
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
    if(typeof(msg) == "string") {
      text.val(msg);
    }
  }
});

function initialize_tweets(id)  {
  $.initialize_tweets(id);
}
