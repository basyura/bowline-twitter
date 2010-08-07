
TweetsBinder.poll
MentionsBinder.poll

Thread.new do  
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
  loop do
    sleep 120
    begin
      MentionsBinder.poll
    rescue => e
      puts e
    end
  end
end
