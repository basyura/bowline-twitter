
require 'rubytter'

class Rubytter
  BOWLINE_CONSUMER_KEY    = 'BIKtyLSmobTuHbxmqJNw'
  BOWLINE_CONSUMER_SECRET = 'Yv356QLaXAG3yPMYzy90yp66AlE3JynZYLaYXsMeA'
  BOWLINE_CONF            = File.expand_path('~/.bowline_twitter')
  def self.newInstance
    raise OAuth::Unauthorized unless File.exist?(BOWLINE_CONF)
    tokens = File.open(BOWLINE_CONF) {|f| f.read.split(/\n/) }
    consumer = ::OAuth::Consumer.new(
      BOWLINE_CONSUMER_KEY,
      BOWLINE_CONSUMER_SECRET,
      :site => "http://twitter.com"
    )
    token = ::OAuth::AccessToken.new(
      consumer,
      tokens[0],
      tokens[1]
    )
    OAuthRubytter.new(token)
  end
  def self.authenticate?
    return true
    begin
      self.newInstance.verify_credentials
      true
    rescue => e
      false
    end
  end
end
