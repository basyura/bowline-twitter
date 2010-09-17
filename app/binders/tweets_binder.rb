
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def poll
      puts "#{Time.now} poll tweets start"

      since_id = Status.get("newest_id") 
      @mode ||= TweetBase::FRIENDS
      if @mode == TweetBase::SEARCH
        tweets  = klass.search(@search_word)
      else
        tweets  = klass.poll(@mode , since_id)
      end
      self.items = tweets

      Status.change("newest_id" , tweets[0].id) if tweets.length != 0
      self.page.initialize_tweets(since_id).call
      puts "#{Time.now} poll tweets end"
    end
    def change_list(mode)
      puts "change_list to #{mode}"
      @mode = mode.to_sym
      poll
    end
    def change_search_word(word)
      puts "change_search_word to #{word}"
      @mode = TweetBase::SEARCH
      @search_word = word
      poll
    end
    def list_names
      callback Tweet.list_names
    end
  end
end
