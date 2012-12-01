class ServiceController < ApplicationController
  def get_capabilities
    render :layout => false, :formats => :xml
  end

  def get_domain
    render :layout => false, :formats => :xml
  end

  def get_records
    render :layout => false, :formats => :xml
  end

  def get_record_by_id
    render :layout => false, :formats => :xml
  end

  def not_implemented_exception
    render :layout => false, :formats => :xml, :status => 404
  end
end
