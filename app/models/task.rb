class Task < ApplicationRecord
  belongs_to :lane
  has_many :tags
end
