class ServiceController < ApplicationController
  def GetCapabilities
    render :layout => false, :formats => :xml
  end
end
