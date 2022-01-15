if (Rails.env.dev?)
  Rack::MiniProfiler.config.position = 'bottom-right'
end