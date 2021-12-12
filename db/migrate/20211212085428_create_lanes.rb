class CreateLanes < ActiveRecord::Migration[6.1]
  def change
    create_table :lanes do |t|
      t.belongs_to :project, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
