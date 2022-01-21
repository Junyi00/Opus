class LaneSerializer < ActiveModel::Serializer
  attributes :id, :name, :pos, :children
  # has_many :tasks

  def children
    ActiveModelSerializers::SerializableResource.new(object.tasks.order('pos'),  each_serializer: TaskSerializer)
  end
end
