Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      # task management
      resources :projects
      resources :lanes
      resources :tasks
      resources :tags
      
      # user authentication
      resources :users, only: [:create, :update]
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      get '/logged_in', to: 'sessions#is_logged_in?'
      post 'password/forgot', to: 'password#forgot'
      post 'password/reset', to: 'password#reset'
    end
  end

  get '*path', to: 'pages#index', via: :all
end
