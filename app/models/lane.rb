class Lane < ApplicationRecord
  scope :filter_by_project_id, -> (project_id) { where project_id: project_id }

  belongs_to :project
  has_many :tasks
end
