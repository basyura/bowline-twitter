class MentionsBinder < TweetsBinderBase
  bind Mention
  class << self
    def poll
      puts "poll mentions"
      mentions = klass.poll(TweetBase::MENTIONS)
      notify_mentions(mentions)
      self.items = mentions
    end
    private
    #
    def notify_mentions(mentions)
      return if mentions.length == 0
      mentions.each do |tweet|
       if Status.bigger?("last_mention_id" , tweet.id)
         msg = tweet.screen_name
         growl("reply" , "from : " + msg)
       end
     end
      if Status.bigger?("last_mention_id" , mentions[0].id)
        Status.change("last_mention_id" , mentions[0].id)
      end
    end
  end
end
