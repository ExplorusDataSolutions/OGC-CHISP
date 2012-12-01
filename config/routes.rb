module OGCChisp
  class Constraint
    def initialize(request_param)
      @request_param = request_param;
    end
    def matches?(request)
      request.query_parameters["request"] == @request_param
    end
  end
end

OGCChisp::Application.routes.draw do
  match 'csw' => "service#get_capabilities", :constraints => OGCChisp::Constraint.new("GetCapabilities")
  match 'csw' => "service#get_domain", :constraints => OGCChisp::Constraint.new("GetDomain")
  match 'csw' => "service#get_records", :constraints => OGCChisp::Constraint.new("GetRecords")
  match 'csw' => "service#get_record_by_id", :constraints => OGCChisp::Constraint.new("GetRecordById")
  match '404' => "service#not_implemented_exception"
  root :to => "service#not_implemented_exception"
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
