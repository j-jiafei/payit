import os
from gaesessions import SessionMiddleware
def webapp_add_wsgi_middleware(app):
  app = SessionMiddleware(app, cookie_key='paypal123paypal123paypal123paypal123paypal123paypal123paypal123paypal123')
  return app
