class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :children
  # has_many :lanes

  def children
    ActiveModelSerializers::SerializableResource.new(object.lanes.order('pos'),  each_serializer: LaneSerializer)
  end
end
