class ServiceController < ApplicationController
  def get_capabilities
    render :layout => false, :formats => :xml
  end
  def not_implemented_exception
    response.status = 404
    render :layout => false, :formats => :xml
  end
end
