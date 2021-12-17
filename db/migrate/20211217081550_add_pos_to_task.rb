class AddPosToTask < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :pos, :integer
  end
end
