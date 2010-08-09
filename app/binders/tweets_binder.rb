
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def poll
      puts "poll tweets"
      self.items = klass.poll(TweetBase::FRIENDS)
      #self.items = klass.poll(:tottoruby)
    end
  end
end
