class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.belongs_to :lane, null: false, foreign_key: true
      t.string :name
      t.string :description
      t.boolean :starred

      t.timestamps
    end
  end
end
