class AddPosToLane < ActiveRecord::Migration[6.1]
  def change
    add_column :lanes, :pos, :integer
  end
end
