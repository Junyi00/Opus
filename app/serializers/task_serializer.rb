class TaskSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :name, :description, :starred, :created_at, :updated_at
  # has_many :tags
end
