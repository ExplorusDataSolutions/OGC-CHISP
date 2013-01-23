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
    require 'net/http'
    uri = URI("#{csw_service_url}?#{request.query_string}")
    res = Net::HTTP.get_response(uri)

    body = res.body
    .gsub('http://localhost:8080/srv/en/csw', request.base_url + request.path)
    .gsub('http://localhost:8080', request.base_url)

    render :content_type => res["content-type"], :text => body
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
