class LaneSerializer
  include JSONAPI::Serializer
  attributes :name, :pos
  has_many :tasks
end
