
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def login
      puts "login"
      ret = Rubytter.authenticate?
      puts ret
      callback  ret
    end
    def poll
      puts "#{Time.now} poll tweets start"
      @mode ||= TweetBase::FRIENDS
      if @mode == TweetBase::SEARCH
        tweets  = klass.search(@search_word)
      else
        tweets  = klass.poll(@mode)
      end
      self.items = tweets

      id = Status.get("newest_id") 
      Status.change("newest_id" , tweets[0].id) if tweets.length != 0
      self.page.initialize_tweets(id).call
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
