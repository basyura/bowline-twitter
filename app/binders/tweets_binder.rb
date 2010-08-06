
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def poll
      self.items = klass.poll(TweetBase::FRIENDS)
    end
  end
end
