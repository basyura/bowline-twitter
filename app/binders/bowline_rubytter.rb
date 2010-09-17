
require 'rubytter'

class Rubytter
  BOWLINE_CONSUMER_KEY    = 'BIKtyLSmobTuHbxmqJNw'
  BOWLINE_CONSUMER_SECRET = 'Yv356QLaXAG3yPMYzy90yp66AlE3JynZYLaYXsMeA'
  BOWLINE_CONF            = File.expand_path('~/.bowline_twitter')
  def self.newInstance
    raise OAuth::Unauthorized unless File.exist?(BOWLINE_CONF)
    tokens = File.open(BOWLINE_CONF) {|f| f.read.split(/\n/) }
    token = ::OAuth::AccessToken.new(
      consumer,
      tokens[0],
      tokens[1]
    )
    OAuthRubytter.new(token)
  end
  def self.authenticate?
    begin
      self.newInstance.verify_credentials
      true
    rescue => e
      puts e.class.name
      puts e.response.status
      puts e.backtrace
      false
    end
  end
  def self.authorize_url
    @@request_token = consumer.get_request_token
    @@request_token.authorize_url
  end
  def self.authenticate_pin(pin)
    access_token = @@request_token.get_access_token(:oauth_verifier => pin)
    tokens = File.open(BOWLINE_CONF , "w") do |f| 
      f.puts access_token.token
      f.puts access_token.secret
    end
    authenticate?
  end

  private 
  def self.consumer
    consumer = ::OAuth::Consumer.new(
      BOWLINE_CONSUMER_KEY,
      BOWLINE_CONSUMER_SECRET,
      :site => "http://twitter.com"
    )
  end
end
