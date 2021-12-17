class ProjectSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :name, :lanes
  # has_many :lanes

  def lanes
    ActiveModel::SerializableResource.new(object.lanes,  each_serializer: LaneSerializer)
  end
end
