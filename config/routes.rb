module OGCChisp
  class Constraint
    def initialize(request_param)
      @request_param = request_param;
    end

    def matches?(request)
      request.query_parameters["request"] == @request_param
    end
  end

  class Constraint2
    def initialize(&block)
      @block = block;
    end

    def matches?(request)
      @block.call(request)
    end
  end
end

OGCChisp::Application.routes.draw do
  # home controller
  root :to => "home#index"
  
  match "/login" => 'login#login'
  match "/logout" => 'login#logout'

  # map controller
  match '/map' => 'map#index'
  match '/GIS-SFU-subscribe' => 'map#subscribe'
  match '/GIS-SFU-subscription' => 'map#subscription'
  match '/GIS-SFU-cancel-subscribe' => 'map#cancel_subscribe'
  
  # cache controller
  match '/svc/generate-key' => 'cache#api_key'
  match '/svc/cache' => 'cache#index'
  match '/svc/cache/last-value' => 'cache#get_value_by_id', :via => :get,
    :constraints => OGCChisp::Constraint2.new { |request|
      request.query_parameters['id'] =~ /\d+/
    }
  match '/svc/cache/last-value' => 'cache#get_values', :via => :get
  match '/svc/cache/last-value' => 'cache#create_value', :via => :post
  match '/svc/cache/last-value' => 'cache#update_value', :via => :put
  match '/svc/cache/last-value' => 'cache#delete_value', :via => :delete
  match '/svc/cache/last-value/:monitoringPointId' => 'cache#get_last_value', :via => :get
  
  # csw controller
  match '/svc/csw' => "csw#index"
  match '/proxy' => "csw#proxy"
  match '/csw/xml.user.login' => "csw#login"
  match '/csw' => "csw#get_capabilities", :constraints => OGCChisp::Constraint.new("GetCapabilities")
  match '/csw' => "csw#get_domain", :constraints => OGCChisp::Constraint.new("GetDomain")
  match '/csw' => "csw#get_records", :constraints => OGCChisp::Constraint.new("GetRecords")
  match '/csw' => "csw#get_record_by_id", :constraints => OGCChisp::Constraint.new("GetRecordById")
  match '/csw' => "csw#describe_record", :constraints => OGCChisp::Constraint.new("DescribeRecord")
  match '/csw' => "csw#check_post", :via => [:post, :options]

  match '/404' => "csw#not_implemented_exception"
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
