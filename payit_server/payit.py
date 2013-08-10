import webapp2
import jinja2
import os
import json
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


class ProductPullRequestDummyHandler(webapp2.RequestHandler):
  """ Dummy request handler for demo or debugging use """
  def get(self):
    product_list = []
    product0 = { 'name': 'book1', 'pid': 0, 'price': 43.0 }
    product1 = { 'name': 'book2', 'pid': 1, 'price': 63.0 }
    product2 = { 'name': 'book3', 'pid': 2, 'price': 34.0 }
    product_list.append(product0)
    product_list.append(product1)
    product_list.append(product2)
    self.response.write(json.dumps(product_list))


class ProductPullRequestHandler(webapp2.RequestHandler):
  def get(self):
    self.response.write("Hello, Payit!")


application = webapp2.WSGIApplication([
  ('/pull-products', ProductPullRequestDummyHandler),
], debug=True)
