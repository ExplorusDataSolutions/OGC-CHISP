class MapController < ApplicationController
  def index
    @logined_email = logined_email
  end

  def subscribe
    id, email = params.values_at(:id, :email)
    data = params.except(:controller, :action, :format, :id)
    result = { :data => data }

    begin
      sb = Subscription.find(id)
      if sb.email != email
        result[:error] = "No permission to operate POI_ID #{id}"
      else
        status = ["pending", "active", "invalid"]
        data[:status] = status[[status.index(sb.status) + 1, status.length - 1].min]
        sb.update_attributes(data)

        result[:data] = sb
        result[:success] = "POI_ID #{id} update success"
      end
    rescue
      data[:status] = "pending"
      sb = Subscription.new(data)
      sb.save
      result[:data] = sb
      result[:success] = "POI_ID #{sb.id} create success"
    end

    render :json => result
  end

  def subscription
    if params[:email].nil?
      sbs = Subscription.all
    else
      sbs = Subscription.where(:email => params[:email])
    end

   render :json => { :subscriptions => sbs }
  end

  def cancel_subscribe
    id = params[:id]
    email = params[:email]
    result = { :data => { :id => id, :email => email } }

    begin
      sb = Subscription.find(id)
      if sb.email != email
        result[:error] = "No permission to operate POI_ID #{id}"
      elsif sb.status == 'invalid'
        sb.destroy
        result[:success] = "POI_ID #{id} delete success"
      else
        result[:error] = "Only invalid POI can be cancelled"
      end
    rescue
      result[:error] = "POI_ID #{id} not exists"
    end

    render :json => result
  end
end
