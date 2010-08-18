# -*- coding: utf-8 -*-

require 'twitter'

module Twitter
  class List
    include ModelMixin
    @@ATTRIBUTES = [:lists]
    attr_accessor *@@ATTRIBUTES

    class << self
      def attributes; @@ATTRIBUTES; end
    end
  end
  class Status
    include ModelMixin
    @@ATTRIBUTES = [:id, :text, :source, :truncated, :created_at, 
                    :user, :from_user, :to_user,
                    :favorited, :in_reply_to_status_id, :in_reply_to_user_id,
                    :in_reply_to_screen_name,
                    :profile_image_url , :from_user_id 
                   ]
    attr_accessor *@@ATTRIBUTES
  end
end
class Twitter::Client
  @@CACHED_LISTS_NAMES = []
  #
  def lists(username , options={})
    uri = "/#{username}/lists.json"
    response = http_connect {|conn| create_http_get_request(uri, options) }
    timeline = Twitter::List.unmarshal(response.body)
  end
  def list_names(username , options={})
    # username はどこかに保持されてるはず
    if @@CACHED_LISTS_NAMES.empty?
      @@CACHED_LISTS_NAMES = lists(username , options).lists.collect do |list|
        list["slug"]
      end
    end
    @@CACHED_LISTS_NAMES
  end
  #
  def self.add_timeline_uri(type , uri)
    @@TIMELINE_URIS[type] = uri
  end
  #
  def self.add_lists_to_timeline_uris
    client = Twitter::Client.new(
      :login    => AppConfig.username,
      :password => AppConfig.password
    )
    client.list_names(AppConfig.username).each do |name|
      uri  = "/#{AppConfig.username}/lists/#{name}/statuses.json"
      add_timeline_uri(name.to_sym , uri)
    end
  end
end

Twitter::Client.add_lists_to_timeline_uris

class TweetBase < SuperModel::Base
  PUBLIT   = :public
  FRIENDS  = :friends
  MENTIONS = :replies
  ME       = :me
  USER     = :user
  SEARCH   = :search
  @@twitter = nil
  
  class << self
    def poll(mode = FRIENDS)
      destroy_all
      timeline(mode).collect{|tweet| create(tweet) }
    end

    def search(word)
        twitter.search(:q => word).to_a.collect{|status| 
          tweet = status.to_hash
          tweet[:screen_name]   = tweet[:from_user]
          tweet[:formated_text] = nil
          create(tweet)
        }
    end

    def find_mentions
      timeline(MENTIONS).collect{|tweet| self.new(tweet) }
    end

    def update(status , in_reply_to = nil)
      if in_reply_to
        twitter.status(:reply , {:status => status , :in_reply_to_status_id => in_reply_to})
      else
        twitter.status(:post  , status)
      end
    end

    def list_names
      twitter.list_names(AppConfig.username)
    end


    private
      def timeline(mode = FRIENDS)
        twitter.timeline_for(mode , :count => 60).to_a.collect {|status|
          tweet = status.to_hash
          tweet[:profile_image_url] = tweet[:user][:profile_image_url]
          tweet[:screen_name]       = tweet[:user][:screen_name]
          tweet[:formated_text]     = nil
          tweet.delete(:user)
          tweet
        }
      end

      def twitter
        unless @@twitter
          # thread ? safe ?
          @@twitter = Twitter::Client.new(
            :login    => AppConfig.username,
            :password => AppConfig.password
          )
        end
        @@twitter
      end
  end

  def formated_text
    msg = text
    msg = msg.gsub(/>/,'&gt;').gsub(/</,'&lt;');
    msg = msg.gsub(
      /(http:\/\/[a-zA-Z0-9\.\/\?_\-&%=]*)/ ,
      "<a name='link' class='outer_link' href='javascript:void(0);' " +
      "onclick='$.openURL(\"\\1\")'>" +
      '\\1' + "</a>")
    msg
  end
end
