require "twitter"

class TweetBase < SuperModel::Base
  PUBLIT   = :public
  FRIENDS  = :friends
  MENTIONS = :replies
  ME       = :me
  USER     = :user
  #LIST     = :list
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
          tweet[:screen_name] = tweet[:user][:screen_name]
          tweet[:text] = auto_link(tweet[:text])

          tweet.delete(:user)
          tweet
        }
      end

      def auto_link(text)
          text = text.gsub(/>/,'&gt;').gsub(/</,'&lt;');
          text = text.gsub(
            /(http:\/\/[a-zA-Z0-9\.\/\?_\-&%=]*)/ ,
            "<a name='link' class='outer_link' href='javascript:void(0);' " +
              "onclick='$.openURL(\"\\1\")'>" +
              '\\1' + "</a>")
          text
      end

      def twitter
        Twitter::Client.new(
          :login    => AppConfig.username,
          :password => AppConfig.password
        )
      end
  end
end
