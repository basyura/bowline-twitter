class AuthenticateBinder < Bowline::Binders::Collection
  class << self
    def authenticate
     b = Rubytter.authenticate?
     `open -a Firefox #{Rubytter.authorize_url}` unless b
     callback b
    end
    def authenticate_pin(pin)
        callback Rubytter.authenticate_pin(pin)
    end
  end
end
