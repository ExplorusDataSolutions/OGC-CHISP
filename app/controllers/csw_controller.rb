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

    require 'net/http'

    if params[:username] and params[:password]
      uri = URI("http://chisp.elasticbeanstalk.com/srv/en/xml.user.login")
      req = Net::HTTP::Post.new(uri.path)
      req.content_type = "application/xml"
      req.body = <<-XML
<?xml version="1.0" encoding="UTF-8"?>
<request>
    <username>#{params[:username]}</username>
    <password>#{params[:password]}</password>
</request>
XML
      res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }
      if res.body == "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<ok />\r\n\r\n"
        cookie = res['Set-Cookie'];
        cookies["JSESSIONID"] = CGI::Cookie::parse(cookie)["JSESSIONID"]
      end
    end

    if raw_xml != ''
      uri = URI(csw_service_url)
      req = Net::HTTP::Post.new(uri.path)
      req["Cookie"] = cookie.nil? ? ("JSESSIONID=" + request.cookies["JSESSIONID"].to_s) : ''
      req.content_type = "application/xml"
      req.body = raw_xml
      res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }

      body = res.body
      .gsub('http://localhost:8080/srv/en/csw', request.url)
      .gsub('http://localhost:8080', request.base_url)

      render :content_type => res["content-type"], :text => body
    elsif res.nil?
      render :text => ""
    else
      render :content_type => res["content-type"], :text => res.body
    end
  end

  def not_implemented_exception
    response.status = 404
    render :layout => false, :formats => :xml
  end
end
