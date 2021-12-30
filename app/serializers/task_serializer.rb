class TaskSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :id, :name, :description, :starred, :pos, :completed, :duedate, :created_at, :updated_at, :tags
  # has_many :tags

  def tags
    ActiveModel::SerializableResource.new(object.tags,  each_serializer: TagSerializer)
  end
end
