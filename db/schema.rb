# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130121204826) do

  create_table "api_keys", :force => true do |t|
    t.string   "key"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "last_values", :force => true do |t|
    t.string   "monitoringPointId"
    t.string   "point"
    t.datetime "time"
    t.string   "observedProperty"
    t.float    "value"
    t.string   "uom"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
    t.string   "api_key"
  end

  create_table "subscriptions", :force => true do |t|
    t.string   "email"
    t.float    "sw_level_threshold"
    t.float    "sw_flow_threshold"
    t.integer  "frequency"
    t.float    "lat",                :limit => 53
    t.float    "lng",                :limit => 53
    t.string   "station_id"
    t.string   "poi_type"
    t.string   "status"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
  end

end
