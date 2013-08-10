import webapp2
import jinja2
import os
from google.appengine.ext import db

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

class Seller(db.Model):
  email = db.EmailProperty()


class Buyer(db.Model):
  email = db.EmailProperty()


class Product(db.Model):
  price = db.FloatProperty()


class MainPage(webapp2.RequestHandler):
  def get(self):
    self.response.write("Hello, Payit!")


application = webapp2.WSGIApplication([
  ('/', MainPage),
], debug=True)
