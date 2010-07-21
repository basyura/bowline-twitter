require "twitter"

class Tweet < SuperModel::Base
  class << self
    def poll
      destroy_all
      timeline.each do |tweet|
        create(tweet)
      end
    end
    
    def update(status)
      twitter.status(:post , status)
      poll
    end

    private
      def timeline
        twitter.timeline_for(:friends).to_a.reverse.collect {|status|
          tweet = status.to_hash
          tweet[:profile_image_url] = tweet[:user][:profile_image_url]
          tweet.delete(:user)
          tweet
        }
      end

      def twitter
        Twitter::Client.new(
          :login    => AppConfig.username,
          :password => AppConfig.password
        )
      end
  end
end
