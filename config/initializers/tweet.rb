


Thread.new do  
  sleep 1
  TweetsBinder.poll
  loop do
    sleep 30
    begin
      TweetsBinder.poll
    rescue => e
      puts e
    end
  end
end
Thread.new do  
  sleep 5
  MentionsBinder.poll
  loop do
    sleep 120
    begin
      MentionsBinder.poll
    rescue => e
      puts e
    end
  end
end
