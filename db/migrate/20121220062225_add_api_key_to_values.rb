class AddApiKeyToValues < ActiveRecord::Migration
  def change
    add_column :last_values, :api_key, :string
  end
end
