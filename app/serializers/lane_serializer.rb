class LaneSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :name, :pos, :tasks
  # has_many :tasks

  def tasks
    ActiveModel::SerializableResource.new(object.tasks,  each_serializer: TaskSerializer)
  end
end
