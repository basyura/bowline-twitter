# -*- coding: utf-8 -*-

class TweetBase < SuperModel::Base
  FRIENDS  = :friends_timeline
  MENTIONS = :replies
  ME       = :me
  USER     = :user
  SEARCH   = :search
  @@twitter    = nil
  @@list_names = nil
  
  class << self

    def poll(mode , since_id=nil)
      destroy_all
      timeline(mode , since_id).collect{|tweet| create(tweet) }
    end

    def search(word)
        twitter.search(word).to_a.collect{|status| 
          tweet = status.to_hash
          tweet[:profile_image_url] = tweet[:user][:profile_image_url]
          tweet[:screen_name]       = tweet[:user][:screen_name]
          tweet[:formated_text]     = nil
          tweet.delete(:user)
          create(tweet)
        }
    end

    def update(status , in_reply_to = nil)
      twitter.update status , :in_reply_to_status_id => in_reply_to
    end

    def list_names
      unless @@list_names
        @@list_names = twitter.lists(AppConfig.username).lists.map{|i| i.slug.to_sym}
      end
      @@list_names
    end


    private
      def timeline(method , since_id)
        begin
          if list_names.include? method
            statuses = twitter.list_statuses(AppConfig.username , method)
          else
            option = {:count => 60}
            option[:since_id] = since_id if since_id
            statuses = twitter.send(method , option)
            #statuses = twitter.send(method)
          end
          statuses.collect {|status|
            tweet = status.to_hash
            tweet[:profile_image_url] = tweet[:user][:profile_image_url]
            tweet[:screen_name]       = tweet[:user][:screen_name]
            tweet[:formated_text]     = nil
            tweet.delete(:user)
            tweet
          }
        rescue => e
          puts e
        end
      end

      def twitter
        Rubytter.newInstance
      end
  end

  def formated_text
    msg = text
    msg = msg.gsub(/>/,'&gt;').gsub(/</,'&lt;');
    msg = msg.gsub(
      /(http:\/\/[a-zA-Z0-9\.\/\?_\-&%=#]*)/ ,
      "<a name='link' class='outer_link' href='javascript:void(0);' " +
      "onclick='$.openURL(\"\\1\")'>" +
      '\\1' + "</a>")
    msg
  end
end
