class MapController < ApplicationController
  def index
    @logined_email = logined_email
  end

  def subscribe
    id = params["id"]
    data = params.except(:controller, :action, :format, :id)
    data["status"] = "pending"

    begin
      @sb = Subscription.find(id)
      @sb.update_attributes(data)
    rescue
      @sb = Subscription.new(data)
    end
    @sb.save

    render :json => @sb.to_json
  end

  def subscription
    if params[:email].nil?
      @sbs = Subscription.all
    else
      @sbs = Subscription.where(:email => params[:email])
    end

    respond_to do |format|
      format.json { render :json => '[' + @sbs.map { |sb| sb.to_json }.join(',') + ']' }
      format.xml  {
        xml = '<Subscriptions xmlns:gml="http://www.opengis.net/gml/3.2">'
        xml += @sbs.map { |sb| sb.to_xml }.join('')
        xml += '</Subscriptions>'
        render :xml => xml }
    end
  end

  def cancel_subscribe
    id = params["id"]

    begin
      @sb = Subscription.find(id)
      if @sb.status == 'pending'
        @sb.status = 'invalid'
        @sb.save
        status = 'invalid'
      elsif @sb.status == 'invalid'
        @sb.destroy
        status = ''
      else
        status = ''
      end
      result = { :id => id, :status => status, :msg => "success" }
    rescue
      result = { :error => "Poi_id #{id} not exists" }
    end

    render :json => result
  end
end
