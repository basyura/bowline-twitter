class TweetsBinder < Bowline::Binders::Collection
  bind Tweet
  
  class << self
    def initial
      klass.all
    end

    def poll
      klass.poll
      self.items = klass.all
    end
  
    def update(status)
      Bowline::Desktop::App.busy(true)
      klass.update(status)
      Bowline::Desktop::App.busy(false)
      poll
    end
  end
end
