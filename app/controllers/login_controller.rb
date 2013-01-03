class LoginController < ApplicationController
  def index
    @email = params["email"]
    @is_valid_email = is_valid_email? @email
  end
end