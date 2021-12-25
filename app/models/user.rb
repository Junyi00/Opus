class User < ApplicationRecord
    has_secure_password

    validates :username, presence: true, length: { minimum: 4 }, uniqueness: true
    validates :password, presence: true, length: { minimum: 6 }, allow_nil: false
end
