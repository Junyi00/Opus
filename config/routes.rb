Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      # resources :users
      resources :projects
      resources :lanes
      resources :tasks
      resources :tags

      resources :users, only: [:create, :update]
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      get '/logged_in', to: 'sessions#is_logged_in?'
    end
  end

  get '*path', to: 'pages#index', via: :all
end
