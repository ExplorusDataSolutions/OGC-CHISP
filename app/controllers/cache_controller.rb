class CacheController < ApplicationController
  def index
    @lv_all = LastValue.all
  end

  def api_key
    key = UUIDTools::UUID.random_create.to_s

    @key = ApiKey.new(:key => key)
    @key.save

    render :json => key
  end

  def get_value_by_id
    id = params[:id]
    @lv = LastValue.find(id)

    render :json => @lv.to_json
  end

  def create_value
    data = ActiveSupport::JSON.decode(env["rack.input"].read)

    @lv = LastValue.new(data)
    @lv.save

    render :json => @lv.to_json
  end

  def update_value
    data = ActiveSupport::JSON.decode(env["rack.input"].read)

    @lv = LastValue.find(data["id"])
    @lv.update_attributes(data.except("created_at", "id", "updated_at"))

    render :json => @lv.to_json
  end

  def delete_value
    @lv = LastValue.find(params["id"])
    @lv.destroy

    begin
      LastValue.find(params["id"])
      msg = "failure"
    rescue Exception
      msg = "success"
    end

    render :json => ActiveSupport::JSON.encode({:status => msg, :last_value => @lv})
  end

  def get_values
    monitoringPointId = params[:monitoringPointId]
    @lv = LastValue.find(:all, :conditions => ['monitoringPointId = ?', monitoringPointId])

    render :json => '[' + @lv.map { |lv| lv.to_json }.join(',') + ']'
  end

  def get_last_value
    monitoringPointId = params[:monitoringPointId]
    @lv = LastValue.where("monitoringPointId" => monitoringPointId).order("time DESC").first

    render :xml => @lv.to_xml
  end
end
