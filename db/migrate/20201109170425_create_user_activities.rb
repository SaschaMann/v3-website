class CreateUserActivities < ActiveRecord::Migration[6.1]
  def change
    create_table :user_activities do |t|
      t.string :type, null: false

      t.belongs_to :user, null: false
      t.belongs_to :track, null: true

      t.json :params, null: false
      t.datetime :occurred_at, null: false
      t.string :uniqueness_key, null: false, unique: true
      t.string :grouping_key, null: false

      t.integer :version, null: false
      t.json :rendering_data_cache, null: false

      t.timestamps
    end
  end
end
