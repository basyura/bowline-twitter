
TweetsBinder.poll

Thread.new do  
  loop do
    sleep 30
    TweetsBinder.poll
  end
end
Thread.new do  
  loop do
    sleep 60
    TweetsBinder.mentions_notifier
  end
end
