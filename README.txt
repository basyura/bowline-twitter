
use twitter4r

because:

$ ruby script/run
	dlopen(/repos/bowline-twitter-org/vendor/gems/ruby/1.9.1/gems/yajl-ruby-0.7.7/ext/yajl_ext.bundle, 9): no suitable image found.  Did find:
		/repos/bowline-twitter-org/vendor/gems/ruby/1.9.1/gems/yajl-ruby-0.7.7/ext/yajl_ext.bundle: mach-o, but wrong architecture - /repos/bowline-twitter-org/vendor/gems/ruby/1.9.1/gems/yajl-ruby-0.7.7/ext/yajl_ext.bundle
		/repos/bowline-twitter-org/vendor/gems/ruby/1.9.1/gems/activesupport-3.0.0.beta4/lib/active_support/dependencies.rb:212:in `require'


==========================================

A Twitter client for Bowline.

More information about Bowline can be found here:
http://github.com/maccman/bowline

Released under the same license as Bowline (MIT)

Only OSX and ubuntu at the moment. You'll also need Ruby 1.9.

Setup:
  1) Install gem
     >> sudo gem install bowline
  2) Add credentials to application.yml
     >> mv config/application.example.yml config/application.yml
     >> mate config/application.yml
  3) Bundle gems
     >> gem bundle

To run:
>> script/run

To build .app:
>> script/build
