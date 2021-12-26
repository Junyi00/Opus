class Api::V1::SessionsController < ApplicationController
  protect_from_forgery with: :null_session
    
  def create
    @user = User.find_by(username: session_params[:username])
    if @user && @user.authenticate(session_params[:password])
      session[:user_id] = @user.id
      render json: {
        user: UserSerializer.new(@user)
      }
    else
      render json: { 
        status: 401, 
        error: "Could not authenticate your account"
      }
    end
  end

  def is_logged_in?
    logger.info(' [session] :  ' + session.inspect)
    @current_user = User.find(session[:user_id]) if session[:user_id]
    if @current_user
      render json: {
        logged_in: true,
        user: UserSerializer.new(@current_user)
      }
    else
      render json: {
        logged_in: false
      }
    end
  end

  def destroy
    session.delete :user_id
    render json: {
      status: 200,
      logged_out: true
    }
  end

  private

  def session_params
    params.require(:user).permit(:username, :password)
  end

end