class Project < ApplicationRecord
  scope :filter_by_user_id, -> (user_id) { where user_id: user_id }

  belongs_to :user
  has_many :lanes, :dependent => :destroy
end
