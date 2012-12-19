class ServiceController < ApplicationController
  def index
    redirect_to csw_service_url
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

  def not_implemented_exception
    response.status = 404
    render :layout => false, :formats => :xml
  end
end
