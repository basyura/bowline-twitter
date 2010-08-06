
TweetsBinder.poll
MentionsBinder.poll

Thread.new do  
  loop do
    sleep 30
    TweetsBinder.poll
  end
end
Thread.new do  
  loop do
    sleep 60
    MentionsBinder.poll
  end
end
