Mags::Application.routes.draw do
  match 'mags', :to => 'static#mags'
  root :to => "static#mags"
end
