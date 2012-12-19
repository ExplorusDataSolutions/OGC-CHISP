class ServiceController < ApplicationController
  def index

  end
  
  def map
    
  end

  def proxy
    self.content_type = "application/xml"
    self.response_body = %x{curl -G "#{params['url']}"}
  end

  def get_capabilities
    csw_proxy
  end

  def get_domain
    csw_proxy
  end

  def get_records
    csw_proxy
  end

  def get_record_by_id
    csw_proxy
  end

  def describe_record
    csw_proxy
  end

  def test_csw
  end

  def check_post
    raw_xml = request.body.read

    self.content_type = "application/xml"
    self.response_body = %x{curl -X POST -H 'Content-Type: text/xml' -d '#{raw_xml}' "#{csw_service_url}"}
  end

  def last_value_util
    @lv_all = LastValue.all
  end

  def last_values_json
    monitoringPointId = params[:monitoringPointId]
    @lv = LastValue.find(:all, :conditions => ['monitoringPointId = ?', monitoringPointId])

    render :json => '[' + @lv.map { |lv| lv.to_json }.join(',') + ']'
  end

  def last_value_get_json
    id = params[:id]
    @lv = LastValue.find(id)

    render :json => @lv.to_json
  end

  def last_value_get_xml
    monitoringPointId = params[:monitoringPointId]
    @lv = LastValue.where("monitoringPointId" => monitoringPointId).order("time DESC").first

    render :xml => @lv.to_xml
  end

  def last_value_create
    data = ActiveSupport::JSON.decode(env["rack.input"].read)

    @lv = LastValue.new(data)
    @lv.save

    render :json => @lv.to_json
  end

  def last_value_update_json
    data = ActiveSupport::JSON.decode(env["rack.input"].read)

    @lv = LastValue.find(data["id"])
    @lv.update_attributes(data.except("created_at", "id", "updated_at"))

    render :json => @lv.to_json
  end

  def last_value_delete
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

  def not_implemented_exception
    response.status = 404
    render :layout => false, :formats => :xml
  end
end
