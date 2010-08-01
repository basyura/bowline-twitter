class TweetsBinder < Bowline::Binders::Collection
  bind Tweet
  
  class << self
    def initial
      klass.all
    end

    def poll
      # initial より initializer の方が先によばれる
      @mode ||= Tweet::FRIENDS
      klass.poll(@mode)
      self.items = klass.all
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
  end
end
