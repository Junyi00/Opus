class Task < ApplicationRecord
  scope :filter_by_lane_id, -> (lane_id) { where lane_id: lane_id }

  belongs_to :lane
  has_many :tags
end
