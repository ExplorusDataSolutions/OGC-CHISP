class CswController < ApplicationController
  def index
  end

  def proxy
    require 'net/http'
    uri = URI.parse(params['url'])

    if params["xml"]
      response = Net::HTTP.post_form(uri, { "xml" => params["xml"] })
    elsif params["data"]
      response = Net::HTTP.post_form(uri, params["data"])
    else
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

    if response.nil?
      #self.content_type = response["content-type"]
      else
      self.content_type = response["content-type"]
    end

    self.response_body = response.body
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
