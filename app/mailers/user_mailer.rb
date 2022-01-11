class UserMailer < ApplicationMailer
  default from: "opustaskmanager@gmail.com"
  layout 'mailer'

  def send_reset_password(user)
    @user = user
    mail(to: @user.email, subject: 'Opus - Reset Password')
  end

end
