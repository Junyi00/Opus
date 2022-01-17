class Api::V1::UsersController < ApplicationController
      
  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      render json: {
        status: :created,
        user: @user
      }
    else 
      @user.save
      render json: {
        status: 500,
        error: @user.errors.full_messages
      }
    end
  end

  def update
    @user = User.find_by(id: params[:id])
    if @user.authenticate(params[:current_password]) 
      if @user.update(user_params)
        render json: {
          status: :updated,
          user: @user
        }
      else
        puts @user.errors.messages
        render json: { status: 500, error: @user.errors.full_messages }
      end
    else 
      render json: { status: 500, error: "Current password is wrong. Please try again." }
    end
  end
  
  private
    
  def user_params
    params.require(:user).permit(:username, :password, :password_confirmation, :email)
  end
end