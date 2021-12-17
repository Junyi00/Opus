class LaneSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :id, :name, :pos, :children
  # has_many :tasks

  def children
    ActiveModel::SerializableResource.new(object.tasks,  each_serializer: TaskSerializer)
  end
end
