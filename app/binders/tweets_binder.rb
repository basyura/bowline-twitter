
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    # パラメータは文字列のみ？ 0 は渡せなかった
    # boolean もだめぽ
    # ハッシュなら渡せる
    def poll(param = {:diff => true})

      puts "#{Time.now} poll tweets start since #{Status.get("newest_id")} or #{param}"

      since_id = param[:diff] ? Status.get("newest_id") : nil
      @mode ||= TweetBase::FRIENDS
      if @mode == TweetBase::SEARCH
        tweets  = klass.search(@search_word)
      else
        tweets  = klass.poll(@mode , since_id)
      end
      
      self.items = tweets

      Status.change("newest_id" , tweets[0].id) if tweets.length != 0
      self.page.initialize_tweets(tweets.length).call
      puts "#{Time.now} poll tweets end"
    end
    def change_list(mode)
      puts "change_list to #{mode}"
      Status.change("newest_id" , nil)
      @mode = mode.to_sym
      #poll(:diff => false);
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
