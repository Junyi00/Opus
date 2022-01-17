class Api::V1::PasswordController < ApplicationController

  def forgot
    if params[:email].blank? 
      return render json: {status: 500, error: 'Email not found!'}
    end

    user = User.find_by(email: params[:email]) 
    if user.present?
      user.generate_password_token! #generate pass token

      UserMailer.send_reset_password(user).deliver_now
      render json: {status: 'ok'}, status: :ok
    else
      render json: {status: 500, error: 'Email address not found. Please check and try again.'}
    end
  end

  def reset
    token = params[:token].to_s

    user = User.find_by(reset_password_token: token)
    if user.present? && user.password_token_valid?
      if user.reset_password!(params[:password])
        render json: {status: 'ok'}, status: :ok
      else
        render json: {error: user.errors.full_messages}, status: :unprocessable_entity
      end
    else  
      render json: {error:  'Link not valid or expired. Try generating a new link.'}, status: :not_found
    end
  end
end
