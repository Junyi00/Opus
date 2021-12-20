class TagSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :id, :name, :color
end
