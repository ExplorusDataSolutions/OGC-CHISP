class CreateLastValues < ActiveRecord::Migration
  def change
    create_table :last_values do |t|
      t.string :monitoringPointId
      t.string :point
      t.datetime :time
      t.string :observedProperty
      t.float :value
      t.string :uom

      t.timestamps
    end
  end
end
