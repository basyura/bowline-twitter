
class TweetsBinder < TweetsBinderBase
  bind Tweet
  class << self
    def poll
      puts "poll tweets"
      @mode ||= TweetBase::FRIENDS
      self.items = klass.poll(@mode)
    end
    def change_list(mode)
      puts "change_list to #{mode}"
      @mode = mode.to_sym
      poll
    end
    def lists
      callback ["master","tottoruby"]
    end
  end
end
