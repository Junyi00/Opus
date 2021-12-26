class User < ApplicationRecord
    has_secure_password

    validates :username, presence: true, length: { minimum: 4 }, uniqueness: true
    # validates :password, presence: true, length: { minimum: 6 }, allow_nil: false
    validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }, uniqueness: true
end
