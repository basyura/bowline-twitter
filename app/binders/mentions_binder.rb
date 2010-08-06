class MentionsBinder < TweetsBinderBase
  bind Mention
  class << self
    def poll
      mentions = klass.poll(TweetBase::MENTIONS)
      notify_mentions(mentions)
      self.items = mentions
    end
  end
end
