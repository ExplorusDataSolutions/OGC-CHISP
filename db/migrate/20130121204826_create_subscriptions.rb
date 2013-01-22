class CreateSubscriptions < ActiveRecord::Migration
  def change
    create_table :subscriptions do |t|
      t.string :email
      t.float :sw_level_threshold
      t.float :sw_flow_threshold
      t.integer :frequency
      t.float :lat, :limit => 53
      t.float :lng, :limit => 53
      t.string :station_id
      t.string :poi_type
      t.string :status

      t.timestamps
    end
  end
end
