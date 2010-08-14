
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def poll
      puts "#{Time.now} poll tweets start"
      @mode ||= TweetBase::FRIENDS
      tweets  = klass.poll(@mode)
      self.items = tweets

      id = Status.get("newest_id") 
      Status.change("newest_id" , tweets[0].id)
      self.page.initialize_tweets(id).call
      puts "#{Time.now} poll tweets end"
    end
    def change_list(mode)
      puts "change_list to #{mode}"
      @mode = mode.to_sym
      poll
    end
    def list_names
      callback Tweet.list_names
    end
  end
end
