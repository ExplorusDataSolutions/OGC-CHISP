class ApplicationController < ActionController::Base
  protect_from_forgery
  #
  def csw_service_url
    @csw_service_url ||= Rails.application.config.csw_service_url
  end

  #
  def csw_proxy
    csw_params = request.fullpath.split('?')[1] + "&_=" + rand(10000).to_s

    self.content_type = "application/xml"
    self.response_body = %x{curl -G -d "#{csw_params}" "#{csw_service_url}"}
  end
end
