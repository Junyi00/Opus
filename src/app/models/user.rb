class User < ApplicationRecord
    has_secure_password

    validates :username, presence: true, length: { minimum: 4 }, uniqueness: true
    # validates :password, presence: true, length: { minimum: 6 }, allow_nil: false
    validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }, uniqueness: true

    def generate_password_token!
        self.reset_password_token = generate_token
        self.reset_password_sent_at = Time.now.utc
        save!
       end
    
    def password_token_valid?
        (self.reset_password_sent_at + 4.hours) > Time.now.utc
    end
    
    def reset_password!(password)
        self.reset_password_token = nil
        self.reset_password_sent_at = nil
        self.password = password
        save!
    end
    
    private
    
    def generate_token
        SecureRandom.hex(10)
    end
end
