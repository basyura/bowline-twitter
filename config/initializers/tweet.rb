TweetsBinder.poll

Thread.new do  
  loop do
    sleep 30
    TweetsBinder.poll
  end
end
