class Status < SuperModel::Base
  attributes :name , :status
  class << self
    def change(name , status)
      m = find_by_name(name) 
      if m
        m.status = status
        m.save
      else
        create(:name => name , :status => status)
      end
    end
    def get(name)
      v = find_by_name(name)
      v ? v.status : nil
    end
    def bigger?(name , status)
      m = find_by_name(name) 
      return true unless m
      status > m.status
    end
  end
end
