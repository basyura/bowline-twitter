class TweetsBinderBase < Bowline::Binders::Collection
  
  class << self
    def initial
      klass.all
    end

    def poll
      StandardError.new("no implement")
    end

    def mentions_notifier
      notify_mentions(Tweet.find_mentions)
    end

    def update(status)
      #Bowline::Desktop::App.busy(true)
      klass.update(status)
      #Bowline::Desktop::App.busy(false)
      poll
    end

    private
    #
    def growl(title , message)
      g = Growl.new("localhost", "bowline-growl", ["bowline-growl Notification"])
      g.notify("bowline-growl Notification", title , message)
    end
  end
end
