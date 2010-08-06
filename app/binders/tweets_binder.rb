class TweetsBinder < Bowline::Binders::Collection
  bind Tweet
  
  class << self
    def initial
      klass.all
    end

    def poll
      @mode ||= Tweet::FRIENDS
      tweets = klass.poll(@mode)

      notify_mentions(tweets) if @mode == Tweet::MENTIONS

      self.items = tweets
      tweets
    end

    def mentions_notifier
      notify_mentions(Tweet.find_mentions)
    end

    def friends
      @mode = Tweet::FRIENDS
      poll
    end

    def mentions
      @mode = Tweet::MENTIONS
      poll
    end
  
    def update(status)
      Bowline::Desktop::App.busy(true)
      klass.update(status)
      Bowline::Desktop::App.busy(false)
      poll
    end

    private
    #
    def notify_mentions(mentions)
      return if mentions.length == 0
      mentions.each do |tweet|
       if Status.bigger?("last_mention_id" , tweet.id)
         msg = tweet.screen_name
         growl("reply" , "from : " + msg)
       end
     end
      if Status.bigger?("last_mention_id" , mentions[0].id)
        Status.change("last_mention_id" , mentions[0].id)
      end
    end
    #
    def growl(title , message)
      g = Growl.new("localhost", "bowline-growl", ["bowline-growl Notification"])
      g.notify("bowline-growl Notification", title , message)
    end
  end
end
