require 'bowline_rubytter'

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

    def update(statuses)
      puts "update #{statuses["status"]} to #{statuses["in_reply_to"]}"
      #Bowline::Desktop::App.busy(true)
      klass.update(statuses["status"] , statuses["in_reply_to"])
      #Bowline::Desktop::App.busy(false)
      Thread.new do
        poll
      end
    end

    def openURL(url)
      if url.split(" ").length != 1
        self.page.alert("invalid url").call
      else
        `open -a Firefox #{url}`
      end
    end

    private
    #
    def growl(title , message)
      g = Growl.new("localhost", "bowline-growl", ["bowline-growl Notification"])
      g.notify("bowline-growl Notification", title , message)
    end
  end
end
