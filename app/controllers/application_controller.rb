class ApplicationController < ActionController::Base
  protect_from_forgery
  #
  def csw_home_url
    @csw_home_url ||= Rails.application.config.csw_home_url
  end

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

  def is_valid_email? value
    begin
      m = Mail::Address.new(value)
      # We must check that value contains a domain and that value is an email address
      r = m.domain && m.address == value ? true : false
      t = m.__send__(:tree)
      # We need to dig into treetop
      # A valid domain must have dot_atom_text elements size > 1
      # user@localhost is excluded
      # treetop must respond to domain
      # We exclude valid email values like <user@localhost.com>
      # Hence we use m.__send__(tree).domain
      r &&= (t.domain.dot_atom_text.elements.size > 1)
    rescue Exception => e
    r = false
    end
  end
  
  def logined_email
    session[:login_email]
  end
end
