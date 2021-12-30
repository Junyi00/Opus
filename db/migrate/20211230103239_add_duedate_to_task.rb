class AddDuedateToTask < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :duedate, :date
  end
end
