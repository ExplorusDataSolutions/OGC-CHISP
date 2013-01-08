class CswController < ApplicationController
  def index
    redirect_to csw_home_url
  end

  def proxy
    self.content_type = "application/xml"
    uri = URI.parse(params['url'])

    if params["xml"]
      response_body = Net::HTTP.post_form(uri, { "xml" => params["xml"] }).body
    else
      require 'net/http'
      response = Net::HTTP.get_response(uri)

      if response.code == "200"
      response_body = response.body
      elsif response.code == "302"
        # INFO_FORMAT is necessary for responsed xml data
        redirect = response["location"] + "INFO_FORMAT=text/xml"
        response_body = Net::HTTP.get_response(URI.parse(redirect)).body
      else
      response_body = response.inspect
      end
    end

    self.response_body = response_body
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
