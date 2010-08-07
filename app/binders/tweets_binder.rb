
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def poll
      puts "poll tweets"
      self.items = klass.poll(TweetBase::FRIENDS)
    end
  end
end
