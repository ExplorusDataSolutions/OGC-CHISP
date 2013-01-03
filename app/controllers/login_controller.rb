class LoginController < ApplicationController
  def login
    @email = params["email"] || session[:login_email]
    @is_valid_email = is_valid_email? @email unless @email.nil?
    if @is_valid_email
      session[:login_email] = @email
    end
  end

  def logout
    session[:login_email] = nil
    redirect_to :login
  end
end