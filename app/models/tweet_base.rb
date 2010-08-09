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
end
class Twitter::Client
  #
  def lists(username , options={})
    uri = "/#{username}/lists.json"
    response = http_connect {|conn| create_http_get_request(uri, options) }
    timeline = Twitter::List.unmarshal(response.body)
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
    client.lists(AppConfig.username).lists.each do |list|
      name = list["slug"].to_sym
      uri  = "/#{AppConfig.username}/lists/#{name}/statuses.json"
      add_timeline_uri(name , uri)
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
  @@twitter = nil
  
  class << self
    def poll(mode = FRIENDS)
      destroy_all
      timeline(mode).collect{|tweet| create(tweet) }
    end

    def find_mentions
      timeline(MENTIONS).collect{|tweet| self.new(tweet) }
    end

    def update(status)
      twitter.status(:post , status)
    end


    private
      def timeline(mode = FRIENDS)
        twitter.timeline_for(mode).to_a.collect {|status|
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
