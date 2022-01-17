class ProjectSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :id, :name, :children
  # has_many :lanes

  def children
    ActiveModel::SerializableResource.new(object.lanes.order('pos'),  each_serializer: LaneSerializer)
  end
end
