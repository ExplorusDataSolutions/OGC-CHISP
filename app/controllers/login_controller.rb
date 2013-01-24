class LoginController < ApplicationController
  def login
    @old_email = logined_email

    @new_email = params["email"] || @old_email
    @is_valid_email = is_valid_email? @new_email unless @new_email.nil?
    logined_email @new_email if @is_valid_email

    respond_to do |format|
      format.json {
        if @old_email
          render :json => { :email => @old_email, :error => "Email \"#{@old_email}\" already login" }
        elsif @is_valid_email
          render :json => { :email => @new_email, :success => "Email \"#{@new_email}\" login success" }
        else
          render :json => { :email => @new_email, :error => "Invalid email \"#{@new_email}\"" }
        end
      }
      format.html
    end
  end

  def logout
    @email = logined_email
    logined_email nil

    respond_to do |format|
      format.json { render :json => { :error => false, :logined_email => @email } }
      format.html { redirect_to :login }
    end
  end
end