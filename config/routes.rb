Rails.application.routes.draw do
  get "/", to: "home#index"
  resources :nominations
end
