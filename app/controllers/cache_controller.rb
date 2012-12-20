class CacheController < ApplicationController
  def index
    @key = params[:key]
    if @key
        @invalid_key = ApiKey.where(:key => @key).empty? ? true : false
        @lv_all = LastValue.where(:api_key => @key)
    end
    @key_all = ApiKey.all
  end

  def api_key
    key = UUIDTools::UUID.random_create.to_s

    @key = ApiKey.new(:key => key)
    @key.save

    render :json => key
  end

  def get_value_by_id
    @key = params[:key]
    return render :json => { :error => "Invalid API key" } if ApiKey.where(:key => @key).empty?
    
    id = params[:id]
    @lv = LastValue.where(:id => id, :api_key => @key).first

    render :json => @lv.nil? ? { :error => "Non-existing #{id}" } : @lv.to_json
  end

  def create_value
    @key = params[:key]
    ApiKey.where(:key => @key)

    data = ActiveSupport::JSON.decode(env["rack.input"].read)
    data["api_key"] = @key

    @lv = LastValue.new(data)
    @lv.save

    render :json => @lv.to_json
  end

  def update_value
    @key = params[:key]
    return render :json => { :error => "Invalid API key" } if ApiKey.where(:key => @key).empty?
    
    data = ActiveSupport::JSON.decode(env["rack.input"].read)

    @lv = LastValue.find(data["id"])
    return render :json => { :error => "Invalid record #{data['id']}" } unless @lv.api_key == @key
    @lv.update_attributes(data.except("created_at", "id", "updated_at"))

    render :json => @lv.to_json
  end

  def delete_value
    @key = params[:key]
    return render :json => { :error => "Invalid API key" } if ApiKey.where(:key => @key).empty?
    
    @lv = LastValue.find(params["id"])
    return render :json => { :error => "Invalid record #{params['id']}" } unless @lv.api_key == @key
    
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
    @key = params[:key]
    return render :json => { :error => "Invalid API key" } if ApiKey.where(:key => @key).empty?

    monitoringPointId = params[:monitoringPointId]
    @lv = LastValue.where(:monitoringPointId => monitoringPointId, :api_key => @key)

    render :json => '[' + @lv.map { |lv| lv.to_json }.join(',') + ']'
  end

  def get_last_value
    @key = params[:key]
    return render :xml => '<Exception><message>Invalid API key</message></Exception>' if ApiKey.where(:key => @key).empty?
    
    monitoringPointId = params[:monitoringPointId]
    @lv = LastValue.where("monitoringPointId" => monitoringPointId, :api_key => @key).order("time DESC").first

    render :xml => @lv.to_xml
  end
end
