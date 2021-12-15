Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      # resources :users
      resources :projects
      resources :lanes
      resources :project_lanes, only: [:show], param: :project_id
      resources :tasks
      resources :tags
    end
  end

  get '*path', to: 'pages#index', via: :all
end